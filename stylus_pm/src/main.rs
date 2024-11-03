use std::collections::HashMap;
use std::error::Error;
use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct PackageMetadata {
    name: String,
    version: String,
    author: String,
    description: String,
    dependencies: HashMap<String, String>,
    local_dependencies: Vec<PathBuf>,  // New: paths to local dependencies
    checksum: String,
    filename: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct PackageToml {
    name: String,
    version: String,
    author: String,
    description: String,
    dependencies: HashMap<String, String>,
    local_dependencies: Option<Vec<PathBuf>>,  // New: optional local dependencies
}

#[derive(Debug, Serialize, Deserialize)]
struct Registry {
    packages: HashMap<String, Vec<PackageMetadata>>,
    storage_path: PathBuf,
}

impl Registry {
    fn new(storage_path: PathBuf) -> Self {
        Registry {
            packages: HashMap::new(),
            storage_path,
        }
    }

    fn get_storage_dir(&self) -> PathBuf {
        self.storage_path.join("packages")
    }

    // New: Function to resolve and copy local dependencies
    fn resolve_local_dependencies(&self, local_deps: &[PathBuf]) -> Result<Vec<PathBuf>, Box<dyn Error>> {
        let mut resolved_paths = Vec::new();
        let storage_dir = self.get_storage_dir();

        for dep_path in local_deps {
            if !dep_path.exists() {
                return Err(format!("Local dependency not found: {}", dep_path.display()).into());
            }

            let file_name = dep_path.file_name()
                .ok_or("Invalid dependency path")?
                .to_string_lossy()
                .into_owned();

            let dest_path = storage_dir.join("local").join(&file_name);
            fs::create_dir_all(dest_path.parent().unwrap())?;
            fs::copy(dep_path, &dest_path)?;
            resolved_paths.push(dest_path);
        }

        Ok(resolved_paths)
    }

    fn add_package(&mut self, package_path: &Path) -> Result<(), Box<dyn Error>> {
        let content = fs::read(package_path)?;
        let mut hasher = Sha256::new();
        hasher.update(&content);
        let checksum = format!("{:x}", hasher.finalize());
        println!("Generated checksum: {}", checksum);

        let metadata_path = package_path.with_extension("toml");
        let metadata_str = fs::read_to_string(&metadata_path)?;
        
        let toml_data: PackageToml = toml::from_str(&metadata_str)?;

        let storage_dir = self.get_storage_dir();
        fs::create_dir_all(&storage_dir)?;

        // Handle local dependencies
        let local_deps = if let Some(local_deps) = toml_data.local_dependencies {
            self.resolve_local_dependencies(&local_deps)?
        } else {
            Vec::new()
        };

        let stored_filename = format!("{}-{}.rs", toml_data.name, toml_data.version);
        let dest_path = storage_dir.join(&stored_filename);
        
        fs::copy(package_path, &dest_path)?;

        let metadata = PackageMetadata {
            name: toml_data.name,
            version: toml_data.version,
            author: toml_data.author,
            description: toml_data.description,
            dependencies: toml_data.dependencies,
            local_dependencies: local_deps,
            checksum: checksum.clone(),
            filename: stored_filename,
        };

        let package_name = metadata.name.clone();
        let packages = self.packages.entry(package_name.clone()).or_insert_with(Vec::new);
        
        if let Some(index) = packages.iter().position(|c| c.version == metadata.version) {
            packages.remove(index);
        }
        
        packages.push(metadata);
        packages.sort_by(|a, b| a.version.cmp(&b.version));

        self.save()?;
        println!("Added package '{}' to registry with checksum: {}", package_name, checksum);
        Ok(())
    }

    fn get_package(&self, name: &str, version: Option<&str>) -> Option<&PackageMetadata> {
        let packages = self.packages.get(name)?;
        match version {
            Some(ver) => packages.iter().find(|c| c.version == ver),
            None => packages.last(),
        }
    }

    fn verify_package(&self, name: &str, version: Option<&str>) -> Result<bool, Box<dyn Error>> {
        let metadata = self.get_package(name, version)
            .ok_or("Package not found")?;

        let storage_dir = self.get_storage_dir();
        let package_path = storage_dir.join(&metadata.filename);
        
        println!("Verifying package at: {}", package_path.display());
        println!("Expected checksum: {}", metadata.checksum);

        if !package_path.exists() {
            return Err(format!("Package file not found: {}", package_path.display()).into());
        }

        let content = fs::read(&package_path)?;
        let mut hasher = Sha256::new();
        hasher.update(&content);
        let calculated_checksum = format!("{:x}", hasher.finalize());
        
        println!("Calculated checksum: {}", calculated_checksum);
        Ok(calculated_checksum == metadata.checksum)
    }

    fn resolve_dependencies(&self, name: &str, version: Option<&str>) -> Result<Vec<PackageMetadata>, Box<dyn Error>> {
        let mut resolved = Vec::new();
        let mut to_resolve = vec![(name.to_string(), version.map(String::from))];

        while let Some((dep_name, dep_version)) = to_resolve.pop() {
            let metadata = self.get_package(&dep_name, dep_version.as_deref())
                .ok_or(format!("Dependency not found: {}", dep_name))?;

            // Add regular dependencies
            for (name, version) in &metadata.dependencies {
                to_resolve.push((name.clone(), Some(version.clone())));
            }

            // Include local dependencies in the resolution
            if !metadata.local_dependencies.is_empty() {
                println!("Local dependencies for {}: {:?}", metadata.name, metadata.local_dependencies);
            }

            resolved.push(metadata.clone());
        }

        Ok(resolved)
    }

    // Rest of the implementation remains similar, just updated terminology from "contract" to "package"
    fn save(&self) -> Result<(), Box<dyn Error>> {
        let registry_file = self.storage_path.join("registry.json");
        let registry_json = serde_json::to_string_pretty(self)?;
        fs::write(&registry_file, registry_json)?;
        println!("Registry saved to: {}", registry_file.display());
        Ok(())
    }

    fn load(storage_path: PathBuf) -> Result<Self, Box<dyn Error>> {
        let registry_file = storage_path.join("registry.json");
        if registry_file.exists() {
            println!("Loading registry from: {}", registry_file.display());
            let registry_json = fs::read_to_string(&registry_file)?;
            let registry: Registry = serde_json::from_str(&registry_json)?;
            println!("Registry loaded with {} packages", registry.packages.len());
            Ok(registry)
        } else {
            println!("No existing registry found, creating new one");
            Ok(Registry::new(storage_path))
        }
    }

    fn list_packages(&self) -> Vec<(&String, Vec<&str>)> {
        self.packages
            .iter()
            .map(|(name, versions)| (name, versions.iter().map(|m| m.version.as_str()).collect()))
            .collect()
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    let storage_path = PathBuf::from("storage");
    fs::create_dir_all(&storage_path)?;
    
    let mut registry = Registry::load(storage_path.clone())?;

    let args: Vec<String> = std::env::args().collect();
    match args.get(1).map(String::as_str) {
        Some("add") => {
            if args.len() < 3 {
                println!("Usage: rust_pm add <package_path>");
                return Ok(());
            }
            let package_path = Path::new(&args[2]);
            match registry.add_package(package_path) {
                Ok(()) => println!("Package added successfully"),
                Err(e) => println!("Failed to add package: {}", e),
            }
        }
        Some("get") => {
            if args.len() < 3 {
                println!("Usage: rust_pm get <name> [version]");
                return Ok(());
            }
            let name = &args[2];
            let version = args.get(3).map(String::as_str);
            match registry.get_package(name, version) {
                Some(metadata) => println!("Package metadata: {:#?}", metadata),
                None => println!("Package not found"),
            }
        }
        Some("verify") => {
            if args.len() < 3 {
                println!("Usage: rust_pm verify <name> [version]");
                return Ok(());
            }
            let name = &args[2];
            let version = args.get(3).map(String::as_str);
            match registry.verify_package(name, version) {
                Ok(true) => println!("Package verification: Valid"),
                Ok(false) => println!("Package verification: Invalid"),
                Err(e) => println!("Verification error: {}", e),
            }
        }
        Some("deps") => {
            if args.len() < 3 {
                println!("Usage: rust_pm deps <name> [version]");
                return Ok(());
            }
            let name = &args[2];
            let version = args.get(3).map(String::as_str);
            match registry.resolve_dependencies(name, version) {
                Ok(deps) => println!("Dependencies: {:#?}", deps),
                Err(e) => println!("Error resolving dependencies: {}", e),
            }
        }
        Some("list") => {
            println!("Available packages:");
            for (name, versions) in registry.list_packages() {
                println!("  {} (versions: {})", name, versions.join(", "));
            }
        }
        _ => {
            println!("Usage:");
            println!("  add <package_path>     - Add a new package");
            println!("  get <name> [version]   - Get package information");
            println!("  verify <name> [version] - Verify package integrity");
            println!("  deps <name> [version]  - List package dependencies");
            println!("  list                   - List all available packages");
        }
    }

    registry.save()?;
    Ok(())
}