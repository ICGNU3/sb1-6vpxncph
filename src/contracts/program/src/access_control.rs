use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum Role {
    Admin,
    Creator,
    Collaborator,
    Investor,
    User,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub struct AccessControl {
    pub admin: Pubkey,
    pub roles: Vec<(Pubkey, Role)>,
}

impl AccessControl {
    pub fn new(admin: Pubkey) -> Self {
        Self {
            admin,
            roles: vec![(admin, Role::Admin)],
        }
    }

    pub fn has_role(&self, user: &Pubkey, role: &Role) -> bool {
        if *user == self.admin {
            return true;
        }
        self.roles.iter().any(|(u, r)| u == user && r == role)
    }

    pub fn add_role(&mut self, user: Pubkey, role: Role) {
        if !self.has_role(&user, &role) {
            self.roles.push((user, role));
        }
    }

    pub fn remove_role(&mut self, user: &Pubkey, role: &Role) {
        self.roles.retain(|(u, r)| u != user || r != role);
    }

    pub fn is_admin(&self, user: &Pubkey) -> bool {
        *user == self.admin || self.has_role(user, &Role::Admin)
    }
}

// Access control errors
#[error_code]
pub enum AccessControlError {
    #[msg("Unauthorized: Admin access required")]
    UnauthorizedAdmin,
    #[msg("Unauthorized: Creator access required")]
    UnauthorizedCreator,
    #[msg("Unauthorized: Invalid role for this operation")]
    UnauthorizedRole,
}

// Access control checks
pub fn require_admin(access_control: &AccessControl, user: &Pubkey) -> Result<()> {
    if !access_control.is_admin(user) {
        return Err(error!(AccessControlError::UnauthorizedAdmin));
    }
    Ok(())
}

pub fn require_creator(access_control: &AccessControl, user: &Pubkey) -> Result<()> {
    if !access_control.has_role(user, &Role::Creator) {
        return Err(error!(AccessControlError::UnauthorizedCreator));
    }
    Ok(())
}

pub fn require_role(access_control: &AccessControl, user: &Pubkey, role: &Role) -> Result<()> {
    if !access_control.has_role(user, role) {
        return Err(error!(AccessControlError::UnauthorizedRole));
    }
    Ok(())
}