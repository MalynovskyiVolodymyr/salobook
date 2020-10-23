using System;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using supermarketplace.Repositories.common;

namespace supermarketplace.App_Start
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public class UnityConfig
    {
        public static IUnityContainer RegisterComponents()
        {
            var container = Bootstraper.Initialize();
            return container;
        }
    }
}
