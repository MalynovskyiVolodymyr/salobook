using databaseacesslevel.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace databaseacesslevel
{
    public class EFDbContext : DbContext
    {
        public EFDbContext() : base("DefaultConnectionString") { }

        public EFDbContext(string connectionString) : base(connectionString) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Captha> Capthas { get; set; }
        public DbSet<UserControls> UserControls { get; set; }
        public DbSet<Advertising> Advertising { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            base.Configuration.LazyLoadingEnabled = false;

            modelBuilder.Entity<Category>()
                .HasKey(c => c.Id)
                .Property(c => c.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<Category>()
                .Property(c => c.Title)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .HasKey(p => p.Id)
                .Property(p => p.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<Product>()
                .Property(p => p.Title)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .Property(p => p.Description)                
                .HasMaxLength(700);

            modelBuilder.Entity<Product>()
                .Property(p => p.ImgUrl)
                .HasMaxLength(100);

            modelBuilder.Entity<Product>()
                .Property(p => p.CategoryId)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .Property(p => p.UserId)
                .IsRequired();

            modelBuilder.Entity<User>()
                .HasKey(u => u.Id)
                .Property(u => u.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);            

            modelBuilder.Entity<User>()
                .HasMany(u => u.Products);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Messages);           

            modelBuilder.Entity<Profile>()
                .HasKey(p => p.Id)
                .Property(p => p.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<Profile>()
                .Property(p => p.UserEmail)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Profile>()
               .Property(p => p.UserPassword)               
               .IsRequired();

            modelBuilder.Entity<Profile>()
               .Property(u => u.UserName)
               .HasMaxLength(100)
               .IsRequired();

            modelBuilder.Entity<Profile>()
                .Property(u => u.ImgUrl)
                .HasMaxLength(100);

            modelBuilder.Entity<Profile>()
                .HasMany(u => u.MyFriends)
                .WithMany(u => u.FriendsOfMy)
                .Map(map =>
                {
                    map.MapLeftKey("currentUserId");
                    map.MapRightKey("requestedUserId");
                    map.ToTable("Friends");
                });

            modelBuilder.Entity<Profile>()
                .HasMany(u => u.MyFriendRequests)
                .WithMany(u => u.FriendRequests)
                .Map(map =>
                {
                    map.MapLeftKey("currentUserId");
                    map.MapRightKey("requestedUserId");
                    map.ToTable("FriendRequests");
                });

            modelBuilder.Entity<Role>()
                .HasKey(r => r.Id)
                .Property(r => r.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<Role>()
                .Property(r => r.RoleType)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<UserControls>()
                .HasKey(u => u.Id)
                .Property(u => u.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<UserControls>()
                .Property(u => u.Title)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<UserControls>()
                .Property(u => u.RouteName)
                .HasMaxLength(20)
                .IsRequired();

            modelBuilder.Entity<Advertising>()
                .HasKey(a => a.Id)
                .Property(a => a.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<Advertising>()
                .Property(a => a.ImgUrl)
                .HasMaxLength(100);

            modelBuilder.Entity<Advertising>()
                .Property(a => a.Title)
                .HasMaxLength(40);

            modelBuilder.Entity<Advertising>()
                .Property(a => a.InnerImgUrl)
                .HasMaxLength(100);            

        }
    }
}
