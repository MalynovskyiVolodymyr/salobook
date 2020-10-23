using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.messages
{
    public class MessageRepository : EFDbRepository<Message>, IMessageRepository
    {
        public MessageRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}