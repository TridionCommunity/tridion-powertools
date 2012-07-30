using PowerTools;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Xml.Linq;
using Tridion.ContentManager.CoreService.Client;

namespace SynchroniserTest
{
    
    
    /// <summary>
    ///This is a test class for ISchemaFactoryTest and is intended
    ///to contain all ISchemaFactoryTest Unit Tests
    ///</summary>
    [TestClass()]
    public class ISchemaFactoryTest
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


        internal virtual ISchemaFactory CreateISchemaFactory()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ISchemaFactory target = new SchemaFactory(coreService);
            return target;
        }

        /// <summary>
        ///A test for GetSchema
        ///</summary>
        [TestMethod()]
        public void GetSchemaTest()
        {
            ISchemaFactory target = CreateISchemaFactory();
            string schemaID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/TestSchemaOne.xsd";           
            XDocument actual = target.GetSchema(schemaID);
            Assert.AreEqual("testSchemaOne", actual.Root.Element(Ns.xsd + "schema").Attribute("targetNamespace").Value);
            
        }
    }
}
