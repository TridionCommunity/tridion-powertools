using PowerTools;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Xml.Linq;
using Tridion.ContentManager.CoreService.Client;

namespace SynchroniserTest
{
    
    
    /// <summary>
    ///This is a test class for IComponentFactoryTest and is intended
    ///to contain all IComponentFactoryTest Unit Tests
    ///</summary>
    [TestClass()]
    public class IComponentFactoryTest
    {


        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        // 
        //You can use the following additional attributes as you write your tests:
        //
        //Use ClassInitialize to run code before running the first test in the class
        //[ClassInitialize()]
        //public static void MyClassInitialize(TestContext testContext)
        //{
        //}
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()]
        //public static void MyClassCleanup()
        //{
        //}
        //
        //Use TestInitialize to run code before running each test
        //[TestInitialize()]
        //public void MyTestInitialize()
        //{
        //}
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()]
        //public void MyTestCleanup()
        //{
        //}
        //
        #endregion


        internal virtual IComponentFactory CreateIComponentFactory()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            IComponentFactory target = new ComponentFactory(coreService);
            return target;
        }

        /// <summary>
        ///A test for GetComponent
        ///</summary>
        [TestMethod()]
        public void GetComponentTest()
        {
            IComponentFactory target = CreateIComponentFactory();
            string componentID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/01-01.xml";
            XDocument actual = target.GetComponent(componentID);
            Assert.AreEqual(componentID, actual.Element(Ns.tcm+"Component")
                .Element(Ns.tcm+"Info").Element(Ns.tcm + "LocationInfo").Element(Ns.tcm + "WebDAVURL").Value );
        }
    }
}
