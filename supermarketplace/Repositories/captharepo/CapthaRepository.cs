using System;
using System.IO;
using System.Web;
using databaseacesslevel.Models;
using supermarketplace.Repositories.common;

namespace supermarketplace.Repositories.captharepo
{
    public class CapthaRepository : EFDbRepository<Captha>, ICapthaRepository
    {
        
        public CapthaRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
  
    }
}