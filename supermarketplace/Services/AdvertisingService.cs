using databaseacesslevel.Models;
using supermarketplace.Repositories.advertising;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace supermarketplace.Services
{
    public class AdvertisingService : IAdvertisingService
    {
        private readonly IAdvertisingRepository _addsRepo;
        private FileStream _FileStream = null;
        public AdvertisingService(IAdvertisingRepository addsRepo)
        {
            _addsRepo = addsRepo;
        }

        public async Task<bool> AddNew(Advertising newItem, HttpPostedFileBase inner, HttpPostedFileBase backround, HttpServerUtilityBase pathToFolder)
        {           

            if (inner != null && backround != null)
            {
                HttpPostedFileBase[] images = { inner, backround };
                string[] filePath = await WriteAnImage(images, pathToFolder);
                if (filePath != null)
                {
                    newItem.InnerImgUrl = filePath[0];
                    newItem.ImgUrl = filePath[1];
                }
            }else
            {
                return false;
            }

            _addsRepo.Insert(newItem);

            return true;
        }

        public async Task<Advertising> Update(int Id, HttpPostedFileBase inner, HttpPostedFileBase backround, HttpServerUtilityBase pathToFolder)
        {
            var existing = _addsRepo.Get(Id);

            if(existing == null)
            {
                return null;
            }

            if (inner != null && backround != null)
            {
                HttpPostedFileBase[] images = { inner, backround };
                string[] filePath = await WriteAnImage(images, pathToFolder);
                if(filePath != null)
                {
                    existing.InnerImgUrl = filePath[0];
                    existing.ImgUrl = filePath[1];
                }                
            }
            else if(inner != null)
            {
                HttpPostedFileBase[] images = { inner };
                string[] filePath = await WriteAnImage(images, pathToFolder);
                if (filePath != null)
                {
                    existing.InnerImgUrl = filePath[0];
                }                   
            }
            else if(backround != null)
            {
                HttpPostedFileBase[] images = { backround };
                string[] filePath = await WriteAnImage(images, pathToFolder);
                if (filePath != null)
                {
                    existing.ImgUrl = filePath[0];
                }                    
            }                    
            
            return _addsRepo.Update(existing);
        }

        public Advertising Update(Advertising itemToUpdate)
        {
            var existing = _addsRepo.Get(itemToUpdate.Id);
            existing.ImgUrl = itemToUpdate.ImgUrl;
            existing.InnerImgUrl = itemToUpdate.InnerImgUrl;
            existing.InnerText = itemToUpdate.InnerText;
            existing.Title = itemToUpdate.Title;
            return _addsRepo.Update(existing);
        }

        public bool RemoveAdds(Advertising itemToRemove)
        {
            try
            {
                _addsRepo.Delete(_addsRepo.Get(itemToRemove.Id));               
                return true;
            }catch
            {
                return false;
            }
        }

        public double GetUnicNumber(int num)
        {
            return Math.Round((new Random().NextDouble() * 100000 * new Random().NextDouble() * 199999) / 100) + num;
        }

        public async Task<string[]> WriteAnImage(HttpPostedFileBase[] images, HttpServerUtilityBase pathToFolder)
        {
            try
            {
                byte[] innerImageBytesData = null;
                byte[] backroundImageBytesData = null;
                double unic_one = 0;
                double unic_two = 0;
                string path_one = "";
                string path_two = "";
                if (images.Length == 2)
                {
                    //var innerImageContentType = images[0].ContentType;
                    //var backroundImageContentType = images[1].ContentType;
                    innerImageBytesData = new byte[images[0].ContentLength];
                    backroundImageBytesData = new byte[images[1].ContentLength];
                    images[0].InputStream.Read(innerImageBytesData, 0, images[0].ContentLength);
                    images[1].InputStream.Read(backroundImageBytesData, 0, images[1].ContentLength);
                    unic_one = GetUnicNumber(1);
                    unic_two = GetUnicNumber(2);
                    path_one = Path.Combine(pathToFolder.MapPath("~/Content/advertisingImg/"), unic_one.ToString() + ".jpg");
                    path_two = Path.Combine(pathToFolder.MapPath("~/Content/advertisingImg/"), unic_two.ToString() + ".jpg");

                    using (_FileStream = new System.IO.FileStream(path_one, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                    {
                        await _FileStream.WriteAsync(innerImageBytesData, 0, images[0].ContentLength);
                        _FileStream.Flush();
                    }
                    _FileStream = null;
                    using (_FileStream = new System.IO.FileStream(path_two, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                    {
                        await _FileStream.WriteAsync(backroundImageBytesData, 0, images[1].ContentLength);
                        _FileStream.Flush();
                    }

                    return new string[] { "/Content/advertisingImg/" + unic_one + ".jpg", "/Content/advertisingImg/" + unic_two + ".jpg" };
                }
                else 
                {
                    innerImageBytesData = new byte[images[0].ContentLength];
                    images[0].InputStream.Read(innerImageBytesData, 0, images[0].ContentLength);
                    unic_one = GetUnicNumber(11);
                    path_one = Path.Combine(pathToFolder.MapPath("~/Content/advertisingImg/"), unic_one.ToString() + ".jpg");

                    using (_FileStream = new System.IO.FileStream(path_one, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                    {
                        await _FileStream.WriteAsync(innerImageBytesData, 0, images[0].ContentLength);
                        _FileStream.Flush();
                    }

                    return new string[] { "/Content/advertisingImg/" + unic_one + ".jpg" };
                }  
            }
            catch
            {
                return null;
            }
        }
    }
}