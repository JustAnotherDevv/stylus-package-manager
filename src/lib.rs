#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg,
    prelude::*,
};
use alloc::string::String;

sol_storage! {
    pub struct Package {
        string name;
        address owner;
        uint256 version;
        string cid;
    }

    #[entrypoint]
    pub struct VisitorBook {
        mapping(uint256 => Package) packages;
        mapping(string => bool) name_taken;
        uint256 pkg_amount;
    }
}

#[public]
impl VisitorBook {
    // register new pkg
    pub fn register_pkg(&mut self, new_name: String) {
        let visitor = msg::sender();

        if !self.name_taken.get(new_name.clone()) {
            self.name_taken.setter(new_name.clone()).set(true);

            let current_pkg_amount = self.pkg_amount.get();
            
            let mut pinned = std::pin::pin!(self.packages.setter(current_pkg_amount));
            let mut package = pinned.as_mut();
            package.name.set_str(&new_name);
            package.owner.set(visitor);
            package.version.set(U256::from(1));
            package.cid.set_str("");
        }
    }

    // update pkg
    pub fn update_pkg(&mut self, pkg_id: U256, new_cid: String) -> Result<bool, Vec<u8>> {
        let visitor = msg::sender();
        let current_pkg_amount = self.pkg_amount.get();
    
        // Check if package exists
        if pkg_id >= current_pkg_amount {
            return Ok(false);
        }
    
        // First get only the owner to check authorization
        let owner = self.packages.get(pkg_id).owner.get();
    
        // Check if caller is the owner
        if owner != visitor {
            return Ok(false);
        }
    
        // Get current version separately before updating
        let current_version = self.packages.get(pkg_id).version.get();
        let new_version = current_version + U256::from(1);
    
        // Now update the package with new version and CID
        let mut pinned = std::pin::pin!(self.packages.setter(pkg_id));
        let mut pkg_guard = pinned.as_mut();
        
        // Set new version and CID
        pkg_guard.version.set(new_version);
        pkg_guard.cid.set_str(&new_cid);
    
        Ok(true)
    }
    
    pub fn get_pkg_version(&self, pkg_id: U256) -> Result<U256, Vec<u8>> {
        let current_pkg_amount = self.pkg_amount.get();
        
        if pkg_id >= current_pkg_amount {
            return Ok(U256::ZERO);
        }
    
        Ok(self.packages.get(pkg_id).version.get())
    }
}