using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class AdvertisingNewItemModel
    {
        public string Title { get; set; }

        public string InnerText { get; set; }

        public HttpPostedFileBase BackroundImage { get; set; }

        public HttpPostedFileBase InnerImage { get; set; }
    }
}