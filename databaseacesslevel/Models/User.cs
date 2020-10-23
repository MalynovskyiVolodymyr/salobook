using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace databaseacesslevel.Models
{
    public class User
    {
        public int Id { get; set; }        

        private ICollection<Message> _messages;

        public virtual ICollection<Message> Messages
        {
            get
            {
                return _messages ?? (_messages = new Collection<Message>());
            }
            set
            {
                _messages = value;
            }
        }        

        private ICollection<Product> _products;

        public virtual ICollection<Product> Products
        {
            get
            {
                return _products ?? (_products = new Collection<Product>());
            }
            set
            {
                _products = value;
            }
        }
    }
}
