public class RegisterDto
{
    public string? Email { get; set; }
    public string? Password { get; set; }
    public bool? IsGoogleLogin { get; set; }  // Indicates if this registration is via Google
    public string? GoogleToken { get; set; }  // Token for Google authentication
    public string? GoogleId { get; set; }    // Unique ID provided by Google for the user
}
