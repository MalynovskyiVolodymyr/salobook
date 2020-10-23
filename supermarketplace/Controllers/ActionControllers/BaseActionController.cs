using supermarketplace.Repositories.common;
using supermarketplace.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace supermarketplace.Controllers.ActionControllers
{
    public class BaseActionController : Controller
    {
        protected readonly IProcutsClientService _products;
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly ISecuretyService _securetyService;
        protected readonly ICapthaService _capthaService;
        protected readonly IAdvertisingService _advertising;
        protected readonly IUserService _userService;

        public BaseActionController(IUnitOfWork unitOfWork, IProcutsClientService productService, IUserService userService, ISecuretyService securetyService, ICapthaService capthaService, IAdvertisingService advertising)
        {
            _unitOfWork = unitOfWork;
            _products = productService;
            _userService = userService;
            _securetyService = securetyService;
            _capthaService = capthaService;
            _advertising = advertising;
        }
    }
}