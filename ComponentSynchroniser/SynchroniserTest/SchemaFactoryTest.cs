using System.Xml.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PowerTools;
using Tridion.ContentManager.CoreService.Client;
using System.Xml.XPath;
namespace SynchroniserTest
{
    
    
    /// <summary>
    ///This is a test class for SchemaFactoryTest and is intended
    ///to contain all SchemaFactoryTest Unit Tests
    ///</summary>
    [TestClass()]
    public class SchemaFactoryTest
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
        ///A test for SchemaFactory Constructor
        ///</summary>
        [TestMethod()]
        public void SchemaFactoryConstructorTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011"); 
            SchemaFactory target = new SchemaFactory(coreService);
            Assert.IsNotNull(target.coreService);
        }

        /// <summary>
        ///A test for GetSchema
        ///</summary>
        [TestMethod()]
        public void GetSchemaTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            SchemaFactory target = new SchemaFactory(coreService);
            string schemaID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/TestSchemaOne.xsd";
            XDocument actual = target.GetSchema(schemaID);
            Assert.AreEqual("testSchemaOne", actual.Root.Element(Ns.xsd + "schema").Attribute("targetNamespace").Value);
        }

        [TestMethod()]
        public void RootElementNameIsPresentTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            SchemaFactory target = new SchemaFactory(coreService);
            string schemaID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/TestSchemaOne.xsd";
            XDocument actual = target.GetSchema(schemaID);
            Assert.AreEqual<string>("Content", actual.Root.Element(Ns.xsd + "schema").Attribute("RootElementName").Value); 
        }

        [TestMethod()]
        public void KeywordEnumeratedFieldsTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            SchemaFactory target = new SchemaFactory(coreService);
            string schemaID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/TestSchemaCategories.xsd";
            XDocument actual = target.GetSchema(schemaID);
            Assert.IsNotNull(actual.Root.Element("CategoryFieldsEnums"));
            Assert.IsNotNull(actual.Root.XPathEvaluate("CategoryFieldsEnums/tcm:ListKeywords/@FieldName[.='ColoursOne']", Ns.manager));
            Assert.AreEqual<string>("Green", actual.Root.XPathSelectElement("CategoryFieldsEnums/tcm:ListKeywords[@FieldName='ColoursOne']/tcm:Item[1]", Ns.manager).Attribute("Title").Value);
            Assert.AreEqual<string>("Mauve", actual.Root.XPathSelectElement("CategoryFieldsEnums/tcm:ListKeywords[@FieldName='ColoursOne']/tcm:Item[2]", Ns.manager).Attribute("Title").Value);
            Assert.AreEqual<string>("Pink", actual.Root.XPathSelectElement("CategoryFieldsEnums/tcm:ListKeywords[@FieldName='ColoursOne']/tcm:Item[3]", Ns.manager).Attribute("Title").Value);
            Assert.AreEqual<string>("Red", actual.Root.XPathSelectElement("CategoryFieldsEnums/tcm:ListKeywords[@FieldName='ColoursOne']/tcm:Item[4]", Ns.manager).Attribute("Title").Value);
            Assert.AreEqual<string>("Scarlet", actual.Root.XPathSelectElement("CategoryFieldsEnums/tcm:ListKeywords[@FieldName='ColoursOne']/tcm:Item[5]", Ns.manager).Attribute("Title").Value);
            Assert.AreEqual<string>("Yellow", actual.Root.XPathSelectElement("CategoryFieldsEnums/tcm:ListKeywords[@FieldName='ColoursOne']/tcm:Item[6]", Ns.manager).Attribute("Title").Value);
//            <CategoryFieldsEnums>
//- <tcm:ListKeywords Managed="1024" xmlns:tcm="http://www.tridion.com/ContentManager/5.0" FieldName="ColoursOne">
//  <tcm:Item ID="tcm:21-513-1024" Type="1024" Title="Green" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:16" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" /> 
//  <tcm:Item ID="tcm:21-512-1024" Type="1024" Title="Mauve" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:09" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" /> 
//  <tcm:Item ID="tcm:21-515-1024" Type="1024" Title="Pink" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:32" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" /> 
//  <tcm:Item ID="tcm:21-511-1024" Type="1024" Title="Red" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:01" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" /> 
//  <tcm:Item ID="tcm:21-517-1024" Type="1024" Title="Scarlet" Lock="0" IsRoot="false" Modified="2012-07-07T18:32:08" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" /> 
//  <tcm:Item ID="tcm:21-514-1024" Type="1024" Title="Yellow" Lock="0" IsRoot="true" Modified="2012-07-07T18:31:23" Key="" IsAbstract="false" CategoryTitle="Colours" CategoryID="tcm:21-59-512" Icon="T1024L0P0" Allow="268560384" Deny="96" IsNew="false" /> 
//  </tcm:ListKeywords>
//  </CategoryFieldsEnums>
//  </SchemaContainer>

        }

    
    }
}
