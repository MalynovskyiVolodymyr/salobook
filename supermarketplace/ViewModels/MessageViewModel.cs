using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class MessageViewModel
    {
        public int Id { get; set; }

        public int AuthorId { get; set; }

        public int UserSenderId { get; set; }

        public int UserResiverId { get; set; }

        public string MessageText { get; set; }

        public DateTime DateCreated { get; set; }
    }
}