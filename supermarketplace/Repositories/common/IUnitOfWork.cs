using System;
using System.Threading.Tasks;

namespace supermarketplace.Repositories.common
{
    public interface IUnitOfWork : IDisposable
    {
        void Commit();

        Task CommitAsync();
    }
}