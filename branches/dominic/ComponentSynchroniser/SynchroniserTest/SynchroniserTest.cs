using PowerTools;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using Tridion.ContentManager.CoreService.Client;
using System.Xml.Linq;
using System.Xml.XPath;
using System.Xml.Xsl;
using System.Xml;
using System.Diagnostics;

namespace SynchroniserTest
{
    
    
    /// <summary>
    ///This is a test class for SynchroniserTest and is intended
    ///to contain all SynchroniserTest Unit Tests
    ///</summary>
    [TestClass()]
    public class SynchroniserTest
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
        ///A test for Synchroniser Constructor
        ///</summary>
        [TestMethod()]
        [DeploymentItem("Synchroniser.dll")]
        public void SynchroniserConstructorTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ComponentSynchroniser target = new ComponentSynchroniser(coreService);
            Assert.IsNotNull(target.coreService);
            Assert.IsNotNull(target.schemaFactory);
            Assert.IsNotNull(target.componentFactory);
        }

        
        [TestMethod()]
        public void TransformComponentToResultTest()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ComponentSynchroniser target = new ComponentSynchroniser(coreService); 
            string schemaURL = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/TestSchemaOne.xsd";
            var schemaData = (SchemaData)coreService.Read(schemaURL, new ReadOptions());
            string schemaID = schemaData.Id;
            string componentID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/01-01.xml";
            var schemaFactory = new SchemaFactory(coreService);
            var componentFactory = new ComponentFactory(coreService);
            XDocument component = componentFactory.GetComponent(componentID);
            XDocument result = target.TransformDocumentToResult(component, schemaID);
            Assert.IsNotNull(result);
            //TODO - some proper tests

        }

        [TestMethod()]
        public void ResolverIsInvokedByDocumentFunctionForSchemaTest()
        {
            // TODO - think about decoupling this from Tridion. (Does synchroniser need to use a resolver factory?)
            XslCompiledTransform transform = new XslCompiledTransform();
            var stylesheet = XDocument.Parse(@"
            <xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:xsd='http://www.w3.org/2001/XMLSchema' >
                <xsl:template match='/'>
                    <foo>
                      <xsl:value-of select=""document('tcm:21-470-8')/SchemaContainer/xsd:schema/xsd:element/@name""/>
                    </foo>
                    </xsl:template>
            </xsl:stylesheet>");
            XsltSettings settings = new XsltSettings(true, true);
            transform.Load(stylesheet.CreateNavigator(), settings, new XmlUrlResolver());
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            var synchroniser = new ComponentSynchroniser(coreService);
            synchroniser.Transform = transform;
            string schemaID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/TestSchemaOne.xsd"; 
            string componentID = "/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/01-01.xml";
            var schemaFactory = new SchemaFactory(coreService);
            var componentFactory = new ComponentFactory(coreService);
            XDocument component = componentFactory.GetComponent(componentID);
            XDocument result = synchroniser.TransformDocumentToResult(component, schemaID);
            Assert.AreEqual("Content", result.Root.Value);

        }

        [TestMethod()]
        public void schemaCompliantNoEmbedding()
        {
            ComponentSynchroniser target = new ComponentSynchroniser(null);
            var schemaFactory = new EmbeddedResourceSchemaFactory();
            var componentFactory = new EmbeddedResourceComponentFactory();
            XDocument testSchema = schemaFactory.GetSchema(@"SynchroniserTestData.schemaCompliantNoEmbedding.xsd");
            XDocument component = componentFactory.GetComponent(@"SynchroniserTestData.schemaCompliantNoEmbedding.xml");
            StubTcmResolver stubTcmResolver = new StubTcmResolver();
            string fakeSchemaUri = "fake:testSchema";
            stubTcmResolver.Add(fakeSchemaUri , testSchema);
            target.TransformResolver = stubTcmResolver;
            XDocument result = target.TransformDocumentToResult(component, fakeSchemaUri );

            // OK - so these tests are a bit rough. 
            Assert.IsNotNull(result);
            Assert.AreEqual<string>(result.Root.Name.LocalName, "Component");
            Assert.AreEqual<XName>(result.Root.Name, Ns.tcm + "Component");
            Assert.IsNotNull(result.XPathSelectElement("/tcm:Component/tcm:Data/tcm:Content", Ns.manager));
            XNamespace tso = "testSchemaOne";
            XmlNamespaceManager nsm = new XmlNamespaceManager(new NameTable());
            nsm.AddNamespace("tso", "testSchemaOne");
            XElement content = result.Element(Ns.tcm + "Component").Element(Ns.tcm + "Data").Element(Ns.tcm + "Content").Element(tso + "Content");
            Assert.IsNotNull(content);
            Assert.IsNotNull(content.XPathSelectElement("tso:plainTextOneLineMandatory[1][.='Some plain text']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("tso:plainTextOneLineLineMandatoryMultiple[1][.='And some more']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("tso:plainTextOneLineLineMandatoryMultiple[2][.='this time with some extra']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("tso:plainTextOneLineLineMandatoryMultiple[3][.='lines to make it multiple']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("tso:plainTextOneLineEnumCheckbox[1][.='foo']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("tso:plainTextOneLineEnumCheckbox[2][.='wibble']", nsm));
            XElement metadata = result.Element(Ns.tcm + "Component").Element(Ns.tcm + "Data").Element(Ns.tcm + "Metadata").Element(tso + "Metadata");
            Assert.AreEqual<string>("testSchemaOne", metadata.Attribute("xmlns").Value);

        }        

        [TestMethod]
        public void schemaCompliantEmbedded()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ComponentSynchroniser target = new ComponentSynchroniser(coreService);
            var schemaFactory = new EmbeddedResourceSchemaFactory();
            var componentFactory = new EmbeddedResourceComponentFactory();
            var additional = XDocument.Parse(@"<root>
              <Content>
                <embedded1>
                  <plainText overrule='true'>e1pt</plainText>
                  <embedded2>
                    <plainText overrule='true'>e2pt</plainText>
                    <coloursFromCategory overrule='true'>Red</coloursFromCategory>
                    <coloursFromCategory overrule='true'>Scarlet</coloursFromCategory>
                  </embedded2>
                </embedded1>
              </Content>
            </root>");
            target.DefaultsAndOverrides = additional;
            XDocument testSchema = schemaFactory.GetSchema(@"SynchroniserTestData.schemaCompliantEmbedded.xsd");
            StubTcmResolver stubTcmResolver = new StubTcmResolver();
            string fakeSchemaUri = "fake:testSchema"; 
            stubTcmResolver.Add(fakeSchemaUri, testSchema);
            XDocument component = componentFactory.GetComponent(@"SynchroniserTestData.schemaCompliantEmbedded.xml");
            // Yes - this is horrible and I know it, but until I stub everything out, I have a dependency on the core to get embedded stuff, and as soon as you stub the resolver.... 
            // WTF - still deciding if this test makes sense at all (as the core is most accurate and test data is quickly  out of date)... so the quickest way is just to use the core
            PowerTools.SchemaFactory ptSF = new PowerTools.SchemaFactory(coreService);
            stubTcmResolver.Add("tcm:21-519-8", ptSF.GetSchema("tcm:21-519-8"));
            stubTcmResolver.Add("tcm:21-520-8", ptSF.GetSchema("tcm:21-520-8"));

            target.TransformResolver = stubTcmResolver;
            XDocument result = target.TransformDocumentToResult(component, fakeSchemaUri );
            XNamespace contentNs = "embeddingSchema";
            XmlNamespaceManager nsm = new XmlNamespaceManager(new NameTable());
            nsm.AddNamespace("content", "embeddingSchema");
            Assert.IsNotNull(result);
            XElement content = result.Element(Ns.tcm + "Component").Element(Ns.tcm + "Data").Element(Ns.tcm + "Content").Element(contentNs + "Content");
            Assert.IsNotNull(content);
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:plainText[1][.='e1pt']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:embedded2/content:plainText[1][.='e2pt']", nsm));
            // If this test passes, then categories are at least vaguely wired up correctly
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:embedded2[1]/content:coloursFromCategory[.='Red']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:embedded2[2]/content:coloursFromCategory[.='Scarlet']", nsm));
      //<Content xmlns="embeddingSchema">
      //  <embedded1>
      //    <plainText>some plain text in embedded 1</plainText>
      //    <embedded2>
      //      <plainText>and some plain text in embedded 2</plainText>
      //      <coloursFromCategory>Red</coloursFromCategory>
      //    </embedded2>
      //    <embedded2>
      //      <plainText>and some plain text in second embedded 2</plainText>
      //      <coloursFromCategory>Mauve</coloursFromCategory>
      //    </embedded2>
      //  </embedded1>
      //</Content>
        }

        [TestMethod]
        public void schemaCompliantEmbeddedWithOverrides()
        {
            ISessionAwareCoreService coreService = new SessionAwareCoreServiceClient("netTcp_2011");
            ComponentSynchroniser target = new ComponentSynchroniser(coreService);

            var schemaFactory = new EmbeddedResourceSchemaFactory();
            var componentFactory = new EmbeddedResourceComponentFactory();
            XDocument testSchema = schemaFactory.GetSchema(@"SynchroniserTestData.schemaCompliantEmbedded.xsd");
            StubTcmResolver stubTcmResolver = new StubTcmResolver();
            string fakeSchemaUri = "fake:testSchema";
            stubTcmResolver.Add(fakeSchemaUri, testSchema);
            XDocument component = componentFactory.GetComponent(@"SynchroniserTestData.schemaCompliantEmbedded.xml");
            // Yes - this is horrible and I know it, but until I stub everything out, I have a dependency on the core to get embedded stuff, and as soon as you stub the resolver.... 
            // WTF - still deciding if this test makes sense at all (as the core is most accurate and test data is quickly  out of date)... so the quickest way is just to use the core
            PowerTools.SchemaFactory ptSF = new PowerTools.SchemaFactory(coreService);
            stubTcmResolver.Add("tcm:21-519-8", ptSF.GetSchema("tcm:21-519-8"));
            stubTcmResolver.Add("tcm:21-520-8", ptSF.GetSchema("tcm:21-520-8"));

            target.TransformResolver = stubTcmResolver;
            XDocument result = target.TransformDocumentToResult(component, fakeSchemaUri);
            XNamespace contentNs = "embeddingSchema";
            XmlNamespaceManager nsm = new XmlNamespaceManager(new NameTable());
            nsm.AddNamespace("content", "embeddingSchema");
            Assert.IsNotNull(result);
            XElement content = result.Element(Ns.tcm + "Component").Element(Ns.tcm + "Data").Element(Ns.tcm + "Content").Element(contentNs + "Content");
            Assert.IsNotNull(content);
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:plainText[1][.='some plain text in embedded 1']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:embedded2/content:plainText[1][.='and some plain text in embedded 2']", nsm));
            // If this test passes, then categories are at least vaguely wired up correctly
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:embedded2[1]/content:coloursFromCategory[.='Red']", nsm));
            Assert.IsNotNull(content.XPathSelectElement("content:embedded1/content:embedded2[2]/content:coloursFromCategory[.='Mauve']", nsm));
            //<Content xmlns="embeddingSchema">
            //  <embedded1>
            //    <plainText>some plain text in embedded 1</plainText>
            //    <embedded2>
            //      <plainText>and some plain text in embedded 2</plainText>
            //      <coloursFromCategory>Red</coloursFromCategory>
            //    </embedded2>
            //    <embedded2>
            //      <plainText>and some plain text in second embedded 2</plainText>
            //      <coloursFromCategory>Mauve</coloursFromCategory>
            //    </embedded2>
            //  </embedded1>
            //</Content>
        }
    }
}
