public class RegisterDto
{
    public string? Email { get; set; } = string.Empty;
    public string? Password { get; set; } = string.Empty;
    public string? Name {  get; set; } = string.Empty;
    public bool? IsGoogleLogin { get; set; }  // Indicates if this registration is via Google
    public string? GoogleToken { get; set; }  // Token for Google authentication
    public string? GoogleId { get; set; }    // Unique ID provided by Google for the user
}
