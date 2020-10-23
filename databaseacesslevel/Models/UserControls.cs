using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace databaseacesslevel.Models
{
    public class UserControls
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int AccessType { get; set; }
        public string RouteName { get; set; }
    }
}
