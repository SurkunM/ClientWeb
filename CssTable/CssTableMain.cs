namespace CssTable;

public class CssTableMain
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.Run();
    }
}