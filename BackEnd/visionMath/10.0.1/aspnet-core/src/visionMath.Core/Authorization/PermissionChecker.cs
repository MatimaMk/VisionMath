using Abp.Authorization;
using visionMath.Authorization.Roles;
using visionMath.Authorization.Users;

namespace visionMath.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
