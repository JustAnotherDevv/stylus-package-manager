#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg,
    prelude::*,
};
use alloc::string::String;
use alloc::vec::Vec;

sol_storage! {
    // pub struct Review {
    //     string title;
    //     address owner;
    //     uint256 rating;
    // }

    // pub struct Audit {
    //     string metadata;
    //     address auditor;
    //     boolean safe;
    // }
    pub struct Package {
        string name;
        address owner;
        uint256 version;
        string metadata_cid;
        mapping(uint256 => string) version_cids;
        mapping(uint256 => string) tags;
        uint256 tags_count;
        uint256 upvotes;
        mapping(address => bool) has_upvoted;
    }

    // pub struct Verification {
    //     string metadata;
    //     uint256 date;
    //     boolean compiles;
    // }

    #[entrypoint]
    pub struct PackageManager {
        mapping(uint256 => Package) packages;
        mapping(string => bool) name_taken;
        uint256 pkg_amount;
    }
}

#[public]
impl PackageManager {
    pub fn upvote_package(&mut self, pkg_id: U256) -> Result<bool, Vec<u8>> {
        let visitor = msg::sender();
        let current_pkg_amount = self.pkg_amount.get();
    
        if pkg_id >= current_pkg_amount {
            return Ok(false);
        }
    
        let mut pinned = std::pin::pin!(self.packages.setter(pkg_id));
        let mut pkg_guard = pinned.as_mut();
        
        // Check if user has already upvoted
        if pkg_guard.has_upvoted.get(visitor) {
            return Ok(false);
        }
        
        // Mark user as having upvoted
        pkg_guard.has_upvoted.setter(visitor).set(true);
        
        // Increment upvotes
        let current_upvotes = pkg_guard.upvotes.get();
        pkg_guard.upvotes.set(current_upvotes + U256::from(1));
    
        Ok(true)
    }

    pub fn get_package_upvotes(&self, pkg_id: U256) -> Result<U256, Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        if pkg_id >= current_pkg_amount {
            return Ok(U256::ZERO);
        }
        
        Ok(self.packages.get(pkg_id).upvotes.get())
    }

    pub fn has_user_upvoted(&self, pkg_id: U256, user: Address) -> Result<bool, Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        if pkg_id >= current_pkg_amount {
            return Ok(false);
        }
        
        Ok(self.packages.get(pkg_id).has_upvoted.get(user))
    }
     // pub fn verify_pkg(&mut self, pkg_id: U256, metadata_cid: String, status: bool) -> Result<bool, Vec<u8>> {
    //     let verifier = msg::sender();
        
    
    //     Ok(true)
    // }

    // pub fn audit(&mut self, pkg_id: U256, metadata_cid: String, status: bool) -> Result<bool, Vec<u8>> {
    //     let auditor = msg::sender();
        
    
    //     Ok(true)
    // }
    pub fn set_package_tags(&mut self, pkg_id: U256, tags: Vec<String>) -> Result<bool, Vec<u8>> {
        let visitor = msg::sender();
        let current_pkg_amount = self.pkg_amount.get();
    
        if pkg_id >= current_pkg_amount {
            return Ok(false);
        }
    
        let owner = self.packages.get(pkg_id).owner.get();
    
        if owner != visitor {
            return Ok(false);
        }
    
        let mut pinned = std::pin::pin!(self.packages.setter(pkg_id));
        let mut pkg_guard = pinned.as_mut();
        
        pkg_guard.tags_count.set(U256::ZERO);
        
        for (index, tag) in tags.iter().enumerate() {
            let tag_index = U256::from(index);
            let mut tag_setter = std::pin::pin!(pkg_guard.tags.setter(tag_index));
            tag_setter.as_mut().set_str(tag);
        }
        
        pkg_guard.tags_count.set(U256::from(tags.len()));
    
        Ok(true)
    }

    fn get_package_tags(&self, pkg_id: U256) -> Vec<String> {
        let package = self.packages.get(pkg_id);
        let tags_count = package.tags_count.get();
        let mut tags = Vec::new();
        
        let mut i = U256::ZERO;
        while i < tags_count {
            let tag = package.tags.get(i).get_string();
            tags.push(tag);
            i = i + U256::from(1);
        }
        
        tags
    }

    pub fn register_pkg(&mut self, new_name: String, initial_cid: String, initial_metadata_cid: String) {
        let visitor = msg::sender();

        if !self.name_taken.get(new_name.clone()) {
            self.name_taken.setter(new_name.clone()).set(true);

            let current_pkg_amount = self.pkg_amount.get();
            
            let mut pinned = std::pin::pin!(self.packages.setter(current_pkg_amount));
            let mut package = pinned.as_mut();
            package.name.set_str(&new_name);
            package.owner.set(visitor);
            package.version.set(U256::from(1));
            package.metadata_cid.set_str(&initial_metadata_cid);
            package.tags_count.set(U256::ZERO);
            
            let mut version_cids = std::pin::pin!(package.version_cids.setter(U256::from(1)));
            version_cids.as_mut().set_str(&initial_cid);

            self.pkg_amount.set(current_pkg_amount + U256::from(1));
        }
    }

    pub fn get_pkg(&self, pkg_id: U256) -> Result<(String, Address, U256, String, String, Vec<String>), Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        if pkg_id >= current_pkg_amount {
            return Ok((String::new(), Address::ZERO, U256::ZERO, String::new(), String::new(), Vec::new()));
        }

        let package = self.packages.get(pkg_id);
        let version = package.version.get();
        let tags = self.get_package_tags(pkg_id);
        
        Ok((
            package.name.get_string(),
            package.owner.get(),
            version,
            package.version_cids.get(version).get_string(),
            package.metadata_cid.get_string(),
            tags
        ))
    }

    pub fn update_pkg(&mut self, pkg_id: U256, new_cid: String) -> Result<bool, Vec<u8>> {
        let visitor = msg::sender();
        let current_pkg_amount = self.pkg_amount.get();
    
        if pkg_id >= current_pkg_amount {
            return Ok(false);
        }
    
        let owner = self.packages.get(pkg_id).owner.get();
    
        if owner != visitor {
            return Ok(false);
        }
    
        let current_version = self.packages.get(pkg_id).version.get();
        let new_version = current_version + U256::from(1);
    
        let mut pinned = std::pin::pin!(self.packages.setter(pkg_id));
        let mut pkg_guard = pinned.as_mut();
        pkg_guard.version.set(new_version);
        
        let mut version_cids = std::pin::pin!(pkg_guard.version_cids.setter(new_version));
        version_cids.as_mut().set_str(&new_cid);
    
        Ok(true)
    }

    pub fn update_metadata(&mut self, pkg_id: U256, new_metadata_cid: String) -> Result<bool, Vec<u8>> {
        let visitor = msg::sender();
        let current_pkg_amount = self.pkg_amount.get();
    
        if pkg_id >= current_pkg_amount {
            return Ok(false);
        }
    
        let owner = self.packages.get(pkg_id).owner.get();
    
        if owner != visitor {
            return Ok(false);
        }
    
        let mut pinned = std::pin::pin!(self.packages.setter(pkg_id));
        let mut pkg_guard = pinned.as_mut();
        pkg_guard.metadata_cid.set_str(&new_metadata_cid);
    
        Ok(true)
    }

    pub fn get_pkg_cid(&self, pkg_id: U256, version: U256) -> Result<String, Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        if pkg_id >= current_pkg_amount {
            return Ok(String::new());
        }

        let package = self.packages.get(pkg_id);
        let pkg_version = package.version.get();
        
        if version > pkg_version || version == U256::ZERO {
            return Ok(String::new());
        }

        Ok(package.version_cids.get(version).get_string())
    }
    
    pub fn get_pkg_version(&self, pkg_id: U256) -> Result<U256, Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        if pkg_id >= current_pkg_amount {
            return Ok(U256::ZERO);
        }
    
        Ok(self.packages.get(pkg_id).version.get())
    }

    pub fn get_pkg_amount(&self) -> Result<U256, Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        Ok(current_pkg_amount)
    }
}