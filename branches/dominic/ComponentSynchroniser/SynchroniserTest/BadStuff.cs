using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Xml.Xsl;
using System.Xml;
using System.Xml.Linq;
using System.Xml.XPath;
using System.Diagnostics;

namespace SynchroniserTest
{
    [TestClass]
    public class BadStuff
    {
        [TestMethod]
        public void TestMethod1()
        {
            var doc = XDocument.Parse(@"<Compound>
  <tcm:Component ID='tcm:21-523' xmlns:tcm='http://www.tridion.com/ContentManager/5.0'>
    <tcm:Info>
      <tcm:LocationInfo>
        <tcm:WebDAVURL>/webdav/Synchroniser%20tests/Building%20Blocks/TestSchemaOne/EmbeddingTest.xml</tcm:WebDAVURL>
      </tcm:LocationInfo>
    </tcm:Info>
    <tcm:Data>
      <tcm:Content>
        <Content xmlns='embeddingSchema'>
          <embedded1>
            <plainText>some plain text in embedded 1</plainText>
            <embedded2>
              <plainText>and some plain text in embedded 2</plainText>
              <coloursFromCategory>Red</coloursFromCategory>
            </embedded2>
            <embedded2>
              <plainText>and some plain text in second embedded 2</plainText>
              <coloursFromCategory>Mauve</coloursFromCategory>
            </embedded2>
          </embedded1>
        </Content>
      </tcm:Content>
    </tcm:Data>
  </tcm:Component>
  <SchemaContainer>
    <xsd:schema elementFormDefault='qualified' targetNamespace='embeddingSchema' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns='embeddingSchema' xmlns:tcmi='http://www.tridion.com/ContentManager/5.0/Instance' RootElementName='Content'>
      <xsd:import namespace='http://www.tridion.com/ContentManager/5.0/Instance' schemaLocation='cm_xml_inst.xsd' />
      <xsd:include schemaLocation='tcm:21-519-8' />
      <xsd:annotation>
        <xsd:appinfo>
          <tcm:Labels xmlns:tcm='http://www.tridion.com/ContentManager/5.0'>
            <tcm:Label ElementName='embedded1' Metadata='false'>embedded1</tcm:Label>
          </tcm:Labels>
        </xsd:appinfo>
      </xsd:annotation>
      <xsd:element name='Content'>
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name='embedded1' minOccurs='1' maxOccurs='1' type='Embed1Root'>
              <xsd:annotation>
                <xsd:appinfo>
                  <tcm:ExtensionXml xmlns:tcm='http://www.tridion.com/ContentManager/5.0' />
                  <tcm:EmbeddedSchema xlink:href='tcm:21-519-8' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:tcm='http://www.tridion.com/ContentManager/5.0' xlink:title='embed1' />
                </xsd:appinfo>
              </xsd:annotation>
            </xsd:element>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </SchemaContainer>
</Compound>");
            var trans = XDocument.Parse(@"<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:tcm='http://www.tridion.com/ContentManager/5.0' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:tcmi='http://www.tridion.com/ContentManager/5.0/Instance' xmlns:msxsl='urn:schemas-microsoft-com:xslt' xmlns:script='urn:script' exclude-result-prefixes='msxsl xsd tcmi'>
  <xsl:output method='xml' version='1.0' encoding='UTF-8' indent='yes' omit-xml-declaration='yes'/>
  <xsl:param name='SchemaURI'>this is the default value of SchemaURI in the XSLT</xsl:param>
  <xsl:variable name='schemaContainer' select='document($SchemaURI)/SchemaContainer'/>
  <xsl:variable name='rootelementname' select='$schemaContainer/xsd:schema/@RootElementName'/>
  <!-- REFACTOR really! - do the field enums from the resolver - far more of this from the resolver -->
  <xsl:variable name='categoryFieldsEnums' select='$schemaContainer/CategoryFieldsEnums'/>
  <xsl:variable name='SchemaFields' select='$schemaContainer/xsd:schema/xsd:element[@name=$rootelementname]'/>
  <xsl:variable name='MetadataFields' select=""$schemaContainer/xsd:schema/xsd:element[@name='Metadata']""/>
  <xsl:variable name='namespace' select='$schemaContainer/xsd:schema/@targetNamespace'/>
  <xsl:variable name='CompDoc' select='/Compound'/>
  <xsl:template match='/'>
<foo>
    <xsl:value-of select='$SchemaURI'/>
</foo>
</xsl:template>
</xsl:stylesheet>");

            var args = new XsltArgumentList();
            args.AddParam("SchemaURI", string.Empty, "FooBarFlub");

            var transform = new XslCompiledTransform();
            XsltSettings settings = new XsltSettings(true, true);
            transform.Load(trans.CreateNavigator(),settings, null);

            XDocument resultsDoc = new XDocument();
            using (XmlWriter results = resultsDoc.CreateWriter())
            {
                transform.Transform(doc.CreateReader(), args, results, null);
            }
            Assert.AreEqual<string>("FooBarFlub",resultsDoc.Element("foo").Value );
        }
    }
}
