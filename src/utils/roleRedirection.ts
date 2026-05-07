export const getDefaultDashboard = (role: string | undefined): string => {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin';
    case 'partner':
      return '/spaceportal';
    case 'affiliate':
      return '/affiliate-portal';
    default:
      return '/';
  }
};
