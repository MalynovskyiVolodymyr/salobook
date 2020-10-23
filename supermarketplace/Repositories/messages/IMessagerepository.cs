using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.messages
{
    public interface IMessageRepository : IRepository<Message>
    {
    }
}