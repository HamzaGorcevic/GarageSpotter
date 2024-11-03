namespace AutoHub.Models
{
    public class ServiceResponse<T>
    {

        public string Message {  get; set; }  = string.Empty;   
        public bool Success { get; set; }
        public T ?Value { get; set; }
    }
}
