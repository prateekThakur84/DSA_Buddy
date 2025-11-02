export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  
  if (user.firstName) {
    return user.firstName.slice(0, 2).toUpperCase();
  }
  
  if (user.email) {
    const emailName = user.email.split('@')[0];
    const parts = emailName.split(/[\\._\\-]/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return emailName.slice(0, 2).toUpperCase();
  }
  
  return 'U';
};

export const getDisplayName = (user) => {
  if (!user) return 'User';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  return user.firstName || user.email || 'User';
};

export const getActiveTab = (location, navItems, adminNavItems) => {
  const currentPath = location.pathname;
  const allItems = [...navItems, ...adminNavItems];
  const currentItem = allItems.find(item => 
    item.path === currentPath || currentPath.startsWith(item.path + '/')
  );
  return currentItem?.id || 'home';
};
