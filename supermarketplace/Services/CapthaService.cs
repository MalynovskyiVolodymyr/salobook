using databaseacesslevel.Models;
using supermarketplace.Repositories.captharepo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace supermarketplace.Services
{
    public class CapthaService : ICapthaService
    {
        private readonly ICapthaRepository _capthas;
        private FileStream _FileStream = null;
        //private FileInfo _FileDeleteStream = null;

        public CapthaService(ICapthaRepository capthaRepo)
        {
            _capthas = capthaRepo;
        }

        public async Task<IEnumerable<Captha>> GetAllCapthas()
        {
            return await _capthas.Select();
        }

        public bool AddNewCaptha(HttpPostedFileBase image, string verificationCode, HttpServerUtilityBase pathToFolder)
        {
            try
            {
                var imageContentType = image.ContentType;//need check if image/jpeg in controller
                var imaBytesData = new byte[image.ContentLength];
                image.InputStream.Read(imaBytesData, 0, image.ContentLength);

                var unic_number = Math.Round((new Random().NextDouble() * 100000 * new Random().NextDouble() * 199999) / 100);
                var path = Path.Combine(pathToFolder.MapPath("~/Content/captchaImg/"), unic_number.ToString() + ".jpg");

                using (_FileStream = new System.IO.FileStream(path, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                {
                    _FileStream.Write(imaBytesData, 0, image.ContentLength);
                    _FileStream.Flush();
                }

                _capthas.Insert(new Captha { CaptchaImgUrl = "/Content/captchaImg/" + unic_number + ".jpg", VerificationKey = verificationCode });

                return true;

            }
            catch
            {
                return false;
            }
        }

        public bool DeleteCaptha(Captha captha)
        {
            try
            {
                _capthas.Delete(_capthas.Get(captha.Id));
                return true;
            }
            catch
            {
                return false;
            }
        }
        //public bool DeleteCaptha(Captha captha)
        //{
        //    var capthaToDelete = _capthas.Get(captha.Id);
        //    if (captha == null)
        //    {
        //        return false;
        //    }
        //    _capthas.Delete(capthaToDelete);
        //    return true;
        //    try
        //    {
        //        _FileDeleteStream = new FileInfo(capthaToDelete.ImgUrl);
        //        _FileDeleteStream.Delete();

        //        _capthas.Delete(capthaToDelete);

        //        return true;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

        public Captha UpdateCaptha(Captha captha)
        {
            var tempCaptha = _capthas.Get(captha.Id);
            if (tempCaptha != null)
            {
                tempCaptha.VerificationKey = captha.VerificationKey;
                return _capthas.Update(tempCaptha);
            }
            return null;
        }

        public async Task<Captha> FindRandomCaptha()
        {
            Random randomiser = new Random();
            IEnumerable<Captha> countOfItems = await _capthas.Select();

            var number = randomiser.Next(0, countOfItems.Count()-1);

            return countOfItems.ElementAt(number);
        }

        public async Task<bool> CheckIfCapthaValidationPassed(string verification, int capthaId)
        {
            var capthaToCompare = await _capthas.GetAsync(capthaId);

            if (capthaToCompare == null)
            {
                return false;
            }

            return (String.Compare(capthaToCompare.VerificationKey, 0, verification, 0, capthaToCompare.VerificationKey.Length, StringComparison.OrdinalIgnoreCase) == 0);
        }
    }
}