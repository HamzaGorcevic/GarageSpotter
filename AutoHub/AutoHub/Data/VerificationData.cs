public class VerificationData
{
    public string Email { get; set; }       // The user's email address
    public string Name { get; set; }        // The user's name
    public string Password { get; set; }    // The user's plain password (or hash if preferred)
    public string Token { get; set; }       // The unique verification token
    public DateTime TokenExpiry { get; set; } // The expiry date/time of the token
}
