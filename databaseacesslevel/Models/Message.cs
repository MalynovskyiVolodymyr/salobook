using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace databaseacesslevel.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int AuthorId { get; set; }

        [ForeignKey("AuthorId")]
        public virtual User Author { get; set; }

        public int UserSenderId { get; set; }

        public int UserResiverId { get; set; }

        public string MessageText { get; set; }

        public DateTime DateCreated { get; set; }
    }
}
