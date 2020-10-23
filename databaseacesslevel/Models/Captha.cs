using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace databaseacesslevel.Models
{
    public class Captha
    {
        public int Id { get; set; }

        public string CaptchaImgUrl { get; set; }

        public string VerificationKey { get; set; }
    }
}
