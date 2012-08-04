using PowerTools.ComponentSynchroniser;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using Tridion.ContentManager.CoreService.Client;
using System.Xml.Linq;

namespace PowerTools.ComponentSynchroniser.Test
{
    
    
    /// <summary>
    ///This is a test class for ComponentFactoryTest and is intended
    ///to contain all ComponentFactoryTest Unit Tests
    ///</summary>
    [TestClass()]
    public class ComponentFactoryTest
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


        /// <summary>
        ///A test for ComponentFactory Constructor
        ///</summary>
        [TestMethod()]
        public void ComponentFactoryConstructorTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ComponentFactory target = new ComponentFactory(coreService);
            Assert.IsNotNull(target.GetComponent("/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/01-01.xml")); 
        }

        /// <summary>
        ///A test for GetComponent
        ///</summary>
        [TestMethod()]
        public void GetComponentTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ComponentFactory target = new ComponentFactory(coreService); 
            string componentID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/01-01.xml"; 
            XDocument actual = target.GetComponent(componentID);
            
            Assert.AreEqual(componentID, actual.Element(Ns.tcm+"Component")
                                            .Element(Ns.tcm + "Info")
                                                .Element(Ns.tcm + "LocationInfo")
                                                    .Element(Ns.tcm + "WebDAVURL").Value);
        }
    }
}
