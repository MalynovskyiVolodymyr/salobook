using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.advertising
{
    public class AdvertisingRepository : EFDbRepository<Advertising>, IAdvertisingRepository
    {
        public AdvertisingRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }//advertisingImg
    }
}