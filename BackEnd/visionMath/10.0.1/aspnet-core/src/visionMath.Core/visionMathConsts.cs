using visionMath.Debugging;

namespace visionMath;

public class visionMathConsts
{
    public const string LocalizationSourceName = "visionMath";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "5045f66097bd4055bcc1c255f292a892";
}
