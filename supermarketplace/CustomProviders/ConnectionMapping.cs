using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.CustomProviders
{
    public class ConnectionMapping<T>
    {
        private readonly Dictionary<T, string> _connections =
            new Dictionary<T, string>();

        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }

        public void Add(T key, string connectionId)
        {
            lock (_connections)
            {
                if (!string.IsNullOrEmpty(GetConnections(key)))
                {
                    _connections.Remove(key);
                }
                _connections.Add(key, connectionId);
                
            }
        }

        public string GetConnections(T key)
        {
            lock (_connections)
            {
                try
                {
                    return _connections[key];
                }catch
                {
                    return null;
                }
                
            }            
        }

        public void Remove(T key)
        {
            lock (_connections)
            {
                _connections.Remove(key);           
            }
        }
    }
}