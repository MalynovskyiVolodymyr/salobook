using System;

namespace databaseacesslevel.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime? DateCreated { get; set; }
        public string Description { get; set; }        
        public int UserId { get; set; }
        public string ImgUrl { get; set; }
        public bool IsChecked { get; set; }
        public bool RequestToPublic { get; set; }
        public int CategoryId { get; set; }
       
    }
}
