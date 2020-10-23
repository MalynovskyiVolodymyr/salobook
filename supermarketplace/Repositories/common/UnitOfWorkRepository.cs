using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace supermarketplace.Repositories.common
{
    public class UnitOfWorkRepository : IUnitOfWork
    {

        private readonly ApplicationDbContext entityFrameworkContext;
        private static readonly object locker = new { };

        private UnitOfWorkRepository()
        {            
            this.entityFrameworkContext = new ApplicationDbContext();
        }

        public static UnitOfWorkRepository Instance;

        public static UnitOfWorkRepository GetUnitOfWork()
        {
            lock (locker) {
                if (Instance == null)
                {
                    Instance = new UnitOfWorkRepository();
                }
                return Instance;
            }
        }

        internal DbSet<T> GetDbSet<T>() where T :class
        {
            return entityFrameworkContext.Set<T>();
        }

        public int UpdateAnyEntity<T>(T item) where T:class
        {
            try
            {
                var entry = entityFrameworkContext.Entry<T>(item);
                entityFrameworkContext.Set<T>().Attach(item);
                entry.State = EntityState.Modified;                
                return 1;
            }catch
            {
                return 0;
            }
        }

        public void AddNewFriendAndRequest<T>(T currentUser, T requestor) where T : class
        {
            entityFrameworkContext.Entry<T>(currentUser).State = EntityState.Modified;
            entityFrameworkContext.Entry<T>(requestor).State = EntityState.Modified;
            //entityFrameworkContext.Set<T>().Attach(requestor);
        }

        public void Commit()
        {
            entityFrameworkContext.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await entityFrameworkContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (this.entityFrameworkContext != null)
                {
                    try
                    {
                        this.entityFrameworkContext.Dispose();
                        UnitOfWorkRepository.Instance = null;
                    }
                    catch { }
                }
            }
        }
    }
}