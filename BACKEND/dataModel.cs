using Microsoft.AspNetCore.Mvc.RazorPages;

namespace RazorPagesSample.Pages
{
    public class IndexModel : PageModel
    {
        public List<string> Items { get; set; } = new();

        public void OnGet()
        {
            apiManager apiManager = new();
            Items = apiManager.GetPropertyNames<Data>();
        }
    }
}
