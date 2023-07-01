using System;
using System.Net.Http;
using Newtonsoft.Json;
using System.Reflection;
using System.Collections.Generic;
using System.IO;

public class apiManager
{
    static string apiUrl =
        "https://api.freecurrencyapi.com/v1/latest?apikey=YLo6e3bz1GmSecvEg01DelPLhgcjv9GX9j8NFnjC";

    public async Task<double> GetCurrencyByCountry(string countryShortName)
    {
        HttpClient client = new();
        string jsonResponse = await client.GetStringAsync(apiUrl);
        Root root = JsonConvert.DeserializeObject<Root>(jsonResponse);
        var property = typeof(Data).GetProperty(countryShortName);
        if (property != null)
        {
            double value = (double)property.GetValue(root.data);
            return value;
        }
        return 0.0;
    }

    public static List<string> GetPropertyNames<T>()
    {
        List<string> propertyNames = new List<string>();
        Type type = typeof(T);
        PropertyInfo[] properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (PropertyInfo property in properties)
        {
            propertyNames.Add(property.Name);
        }
        return propertyNames;
    }
}
