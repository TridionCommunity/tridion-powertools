<!--This is the original XSLT from the old Component Synchroniser. It's here for easy reference, but also because in working on this tool,
I have come to believe that this original work is a righteous hack, and deserves to be credited as such. Is this Quirijn's work? -->
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tcm="http://www.tridion.com/ContentManager/5.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tcmi="http://www.tridion.com/ContentManager/5.0/Instance" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:script="urn:script" exclude-result-prefixes="msxsl xsd tcmi">
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
  <msxsl:script language="JScript" implements-prefix="script">
    <![CDATA[
      function GetKeywords(strElement, strSchemaURI)
      {
         var domKeywordList = new ActiveXObject("MSXML2.DOMDocument.4.0");
         var objTDSE = new ActiveXObject("TDS.TDSE");
         var objSchema = objTDSE.getObject(strSchemaURI, 1);
         var domTridionWebSchema = new ActiveXObject("MSXML2.DOMDocument.4.0");
         domTridionWebSchema.loadXML (objSchema.getTridionWebSchemaXML(1919, true));
         domTridionWebSchema.setProperty ("SelectionNamespaces", "xmlns:tcmapi='http://www.tridion.com/ContentManager/5.0/TCMAPI' xmlns:tcm='http://www.tridion.com/ContentManager/5.0' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");

         var domCategory = domTridionWebSchema.selectSingleNode("//tcm:KeywordField[tcm:Name='" + strElement + "']/tcm:Category");
         if (domCategory != null) {
            var objCategory = objTDSE.getObject(domCategory.getAttribute('xlink:href'), 1);
            if (objCategory != null) domKeywordList.loadXML (objCategory.GetListItems());
         }

         /* destroy objects */
         objTDSE = null;
         objSchema = null;
         
         return domKeywordList;
      }
      
      function OrigGetCategories(itemURI, schemaURI)
      {
         var lObjTDSE = new ActiveXObject("TDS.TDSE");
         var lObjSchema = lObjTDSE.getObject(schemaURI, 1);
         var lStrWebDavURL = lObjSchema.Publication.Info.WebDAVURL + "/" + itemURI;
         var lObjItem = lObjTDSE.getObject(lStrWebDavURL, 1);
         var lObjListCatDOM = new ActiveXObject("MSXML2.DOMDocument.4.0");
         var lStrListCategories = lObjItem.GetListItems();
         lObjListCatDOM.loadXML(lStrListCategories);
         return lObjListCatDOM;
         /* destroy objects */
         lObjTDSE = null;
         lObjSchema = null;
         lObjItem = null;
         lObjListCatDOM = null;
         lStrListCategories = null;
      }
   ]]>
  </msxsl:script>
  <xsl:variable name="DEBUG" select="false()"/>
  <xsl:variable name="debug" select="false()"/>
  <xsl:variable name="SHOW_XML_FILE">
    <xsl:if test="$DEBUG">http://10.124.74.238/Extra/ShowXML.asp?URI=</xsl:if>
  </xsl:variable>
  <xsl:param name="SchemaURI">tcm:2-9-8</xsl:param>
  <xsl:variable name="rootelementname" select="document(concat($SHOW_XML_FILE, $SchemaURI))/tcm:Schema/tcm:Data/tcm:RootElementName/text()"/>
  <xsl:variable name="SchemaFields" select="document(concat($SHOW_XML_FILE, $SchemaURI))/tcm:Schema/tcm:Data/tcm:XSD/xsd:schema/xsd:element[@name=$rootelementname]"/>
  <xsl:variable name="MetadataFields" select="document(concat($SHOW_XML_FILE, $SchemaURI))/tcm:Schema/tcm:Data/tcm:XSD/xsd:schema/xsd:element[@name='Metadata']"/>
  <xsl:variable name="namespace" select="document(concat($SHOW_XML_FILE, $SchemaURI))/tcm:Schema/tcm:Data/tcm:XSD/xsd:schema/@targetNamespace"/>
  <xsl:variable name="CompDoc" select="/"/>
  <xsl:template match="/">
    <tcm:Component xmlns:tcm="http://www.tridion.com/ContentManager/5.0">
      <xsl:copy-of select="$CompDoc/tcm:Component/@*"/>
      <tcm:Data>
        <tcm:Content>
          <xsl:element name="{$rootelementname}" namespace="{$namespace}">
            <xsl:for-each select="$SchemaFields/xsd:complexType/xsd:sequence/xsd:element">
              <xsl:apply-templates select=".">
                <xsl:with-param name="startFields" select="$CompDoc/tcm:Component/tcm:Data/tcm:Content/*[1]"/>
                <xsl:with-param name="contextFields" select="$CompDoc/tcm:Component/tcm:Data/tcm:Content"/>
              </xsl:apply-templates>
            </xsl:for-each>
          </xsl:element>
        </tcm:Content>
        <tcm:Metadata>
          <xsl:if test="count($MetadataFields/xsd:complexType/xsd:sequence/xsd:element) &gt; 0">
            <xsl:element name="Metadata" namespace="{$namespace}">
              <xsl:for-each select="$MetadataFields/xsd:complexType/xsd:sequence/xsd:element">
                <xsl:apply-templates select=".">
                  <xsl:with-param name="startFields" select="$CompDoc/tcm:Component/tcm:Data/tcm:Metadata/*[1]"/>
                  <xsl:with-param name="contextFields" select="$CompDoc/tcm:Component/tcm:Data/tcm:Metadata"/>
                </xsl:apply-templates>
              </xsl:for-each>
            </xsl:element>
          </xsl:if>
        </tcm:Metadata>
      </tcm:Data>
    </tcm:Component>
  </xsl:template>
  <xsl:template match="xsd:element">
    <xsl:param name="startFields"/>
    <xsl:param name="contextFields"/>
    <xsl:param name="fullFields"/>
    <xsl:variable name="currentXSDelement" select="."/>
    <xsl:variable name="type" select="@type"/>
    <xsl:variable name="restriction" select="xsd:simpleType/xsd:restriction"/>
    <!-- Check if we have this field in the content -->
    <xsl:variable name="elementName" select="@name"/>
    <xsl:if test="true()">
      <xsl:comment>
        elementName: <xsl:value-of select="$elementName"/>
      </xsl:comment>
      <xsl:comment>
        <xsl:value-of select="$startFields/*[local-name() = $elementName]" />: <xsl:value-of select="boolean($startFields/*[local-name() = $elementName])"/>
      </xsl:comment>
      <xsl:comment>
        <xsl:value-of select="$contextFields/*[local-name()=$elementName]" />: <xsl:value-of select="boolean($contextFields/*[local-name()=$elementName])"/>
      </xsl:comment>
    </xsl:if>
    <xsl:choose>
      <xsl:when test="xsd:annotation/xsd:appinfo/tcm:EmbeddedSchema">
        <xsl:if test="$debug">
          <xsl:comment> we have an embedded schema </xsl:comment>
        </xsl:if>
        <!-- When the field is an embedded field call the same template again -->
        <xsl:variable name="embeddedSchemaFields" select="document(concat($SHOW_XML_FILE, xsd:annotation/xsd:appinfo/tcm:EmbeddedSchema/@xlink:href))/tcm:Schema/tcm:Data/tcm:XSD/xsd:schema"/>
        <xsl:variable name="embeddedTreeFragment">
          <xsl:choose>
            <!-- If we have existing content -->
            <xsl:when test="$startFields/*[local-name() = $elementName][node()]">
              <xsl:if test="$debug">
                <xsl:comment> we have existing embedded content </xsl:comment>
              </xsl:if>
              <xsl:for-each select="$startFields/*[local-name() = $elementName]">
                <xsl:element name="{$elementName}" namespace="{$namespace}">
                  <xsl:variable name="currentSourceField" select="current()"/>
                  <xsl:for-each select="$embeddedSchemaFields/xsd:complexType/xsd:sequence/xsd:element">
                    <xsl:apply-templates select=".">
                      <xsl:with-param name="startFields" select="$currentSourceField"/>
                      <xsl:with-param name="contextFields" select="$contextFields/*[local-name()=$elementName]"/>
                    </xsl:apply-templates>
                  </xsl:for-each>
                </xsl:element>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <!-- Try to use the added content -->
              <xsl:if test="$debug">
                <xsl:comment> try to use the added embedded content </xsl:comment>
              </xsl:if>
              <xsl:for-each select="$contextFields/*[local-name()=$elementName][node()]">
                <xsl:element name="{$elementName}" namespace="{$namespace}">
                  <!-- Yes, this is an empty field, otherwise we wouldn't be in the otherwise statement -->
                  <xsl:variable name="currentSourceField" select="$startFields/*[local-name() = $elementName]"/>
                  <xsl:for-each select="$embeddedSchemaFields/xsd:complexType/xsd:sequence/xsd:element">
                    <xsl:apply-templates select=".">
                      <xsl:with-param name="startFields" select="/"/>
                      <xsl:with-param name="contextFields" select="$contextFields/*[local-name()=$elementName]"/>
                    </xsl:apply-templates>
                  </xsl:for-each>
                </xsl:element>
              </xsl:for-each>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>
        <xsl:if test="msxsl:node-set($embeddedTreeFragment)/*/node()">
          <xsl:copy-of select="$embeddedTreeFragment"/>
        </xsl:if>
      </xsl:when>
      <!-- When overrule, then ignore existing values -->
      <xsl:when test="$contextFields/*[local-name()=$elementName][@overrule='true']">
        <xsl:if test="$debug">
          <xsl:comment> When overrule, then ignore existing values </xsl:comment>
          <xsl:comment>
            $contextFields/*[local-name()=$elementName][@overrule='true'][text()]: <xsl:value-of select="boolean($contextFields/*[local-name()=$elementName][@overrule='true'][text()])"/>
          </xsl:comment>
          <xsl:comment>
            currentXSDelement: <xsl:value-of select="boolean($currentXSDelement/@type='tcmi:SimpleLink')"/>
          </xsl:comment>
          <xsl:comment>
            concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title): <xsl:value-of select="concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title)"/>
          </xsl:comment>
        </xsl:if>
        <xsl:for-each select="$contextFields/*[local-name()=$elementName][@overrule='true'][text()]">
          <xsl:element name="{$elementName}" namespace="{$namespace}">
            <xsl:choose>
              <xsl:when test="$currentXSDelement/@type='tcmi:SimpleLink'">
                <xsl:attribute name="xlink:href">
                  <xsl:value-of select="text()"/>
                </xsl:attribute>
                <xsl:attribute name="xlink:title">
                  dummy_title<!--<xsl:value-of select="document(concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title))"/>-->
                </xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:apply-templates/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element>
        </xsl:for-each>
      </xsl:when>
      <!-- Use existing values if existent -->
      <xsl:when test="$startFields/*[local-name() = $elementName]">
        <xsl:if test="$debug">
          <xsl:comment> Use existing values if existent </xsl:comment>
          <xsl:comment>
            <xsl:value-of select="name($startFields)"/>
          </xsl:comment>
        </xsl:if>
        <xsl:choose>
          <!-- if the field contains a enumeration or category, check if it still exists -->
          <xsl:when test="$restriction/xsd:enumeration/@value!='' or contains($type, 'category')">
            <xsl:if test="$debug">
              <xsl:comment>
                test op enumeratie: <xsl:value-of select="$restriction/xsd:enumeration/@value"/>
              </xsl:comment>
              <xsl:comment>
                test op categorie: <xsl:value-of select="contains($type, 'category')"/>
              </xsl:comment>
            </xsl:if>

            <!-- This new foreach loop handles multivalue checkboxes, so that Components with multiple boxes checked will remain checked after the Powertool was runned -->
            <xsl:for-each select="$startFields/*[local-name() = $elementName]">
              <xsl:element name="{$elementName}" namespace="{$namespace}">
                <xsl:call-template name="fill-field">
                  <xsl:with-param name="type" select="$type"/>
                  <xsl:with-param name="restriction" select="$restriction"/>
                  <xsl:with-param name="original_value" select="."/>
                  <xsl:with-param name="context_value" select="./text()"/>
                  <xsl:with-param name="elementName" select="$elementName"/>
                </xsl:call-template>
              </xsl:element>
            </xsl:for-each>

          </xsl:when>
          <xsl:otherwise>
            <xsl:if test="$debug">
              <xsl:comment> otherwise (field contains normal content) </xsl:comment>
            </xsl:if>
            <xsl:for-each select="$startFields/*[local-name() = $elementName][.//node() | @xlink:href]">
              <!-- [.//text() | @xlink:href] -->
              <xsl:element name="{$elementName}" namespace="{$namespace}">
                <xsl:copy-of select="@*[local-name()!='overrule']"/>
                <xsl:apply-templates/>
              </xsl:element>
            </xsl:for-each>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <!-- Use new values if there is no current value and we need to have content because the field is mandatory -->
      <xsl:when test="@minOccurs = 1">
        <xsl:if test="$debug">
          <xsl:comment>mandatory fields</xsl:comment>
        </xsl:if>
        <!-- normale xsd elements -->
        <xsl:for-each select="$contextFields/*[local-name()=$elementName][normalize-space(text())]">
          <xsl:element name="{$elementName}" namespace="{$namespace}">
            <xsl:choose>
              <xsl:when test="$currentXSDelement/@type='tcmi:SimpleLink'">
                <xsl:attribute name="xlink:href">
                  <xsl:value-of select="text()"/>
                </xsl:attribute>
                <xsl:attribute name="xlink:title">
                  dummy_title<!--<xsl:value-of select="document(concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title))"/>-->
                </xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:apply-templates/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element>
        </xsl:for-each>
      </xsl:when>
      <!-- When overrule is false, and there are no existing values -->
      <xsl:when test="$contextFields/*[local-name()=$elementName]">
        <xsl:if test="$debug">
          <xsl:comment> When overrule is false, and there are no existing values </xsl:comment>
        </xsl:if>
        <xsl:for-each select="$contextFields/*[local-name()=$elementName][normalize-space(text())!='']">
          <xsl:element name="{$elementName}" namespace="{$namespace}">
            <xsl:choose>
              <xsl:when test="$currentXSDelement/@type='tcmi:SimpleLink'">
                <xsl:attribute name="xlink:href">
                  <xsl:value-of select="text()"/>
                </xsl:attribute>
                <xsl:attribute name="xlink:title">
                  dummy_title<!--<xsl:value-of select="document(concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title))"/>-->
                </xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:apply-templates/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:element>
        </xsl:for-each>
      </xsl:when>
      <xsl:otherwise>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template match="*">
    <xsl:if test="$debug">
      <xsl:comment> match * </xsl:comment>
      <xsl:comment>
        namespace-uri: <xsl:value-of select="namespace-uri()"/>
      </xsl:comment>
    </xsl:if>
    <!--      <xsl:element name="{name()}" namespace="http://www.w3.org/1999/xhtml"> -->
    <xsl:element name="{name()}" namespace="{namespace-uri()}">
      <xsl:copy-of select="@*"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template name="fill-field">
    <xsl:param name="type"/>
    <xsl:param name="restriction"/>
    <xsl:param name="original_value"/>
    <xsl:param name="context_value"/>
    <xsl:param name="elementName"/>
    <xsl:if test="$debug">
      <xsl:comment>
        fill-field <xsl:value-of select="$elementName"/>  type <xsl:value-of select="$type"/>
      </xsl:comment>
      <xsl:comment>
        original value: <xsl:value-of select="$original_value"/>
      </xsl:comment>
      <xsl:comment>
        context value: <xsl:value-of select="$context_value"/>
      </xsl:comment>
    </xsl:if>
    <xsl:choose>
      <!-- the field has a restriction, there are several enumeration values -->
      <xsl:when test="$restriction">
        <!-- check whether the current enumeration value is still valid -->
        <xsl:variable name="is-valid">
          <xsl:value-of select="boolean(msxsl:node-set($restriction)//xsd:enumeration/@value=$original_value)"/>
        </xsl:variable>
        <xsl:if test="$debug">
          <xsl:comment>
            is valid: <xsl:value-of select="$is-valid"/>
          </xsl:comment>
        </xsl:if>
        <xsl:choose>
          <!-- if the enumeration is valid, use the original value -->
          <xsl:when test="$is-valid='true'">
            <xsl:value-of select="$original_value/text()"/>
          </xsl:when>
          <!-- the enumeration is not valid, so check for the context value -->
          <xsl:otherwise>
            <xsl:choose>
              <!-- if the context value is present, use it -->
              <xsl:when test="$context_value!=''">
                <xsl:value-of select="$context_value"/>
              </xsl:when>
              <!-- otherwise, get the first value of the enumeration instead -->
              <xsl:otherwise>
                <xsl:value-of select="msxsl:node-set($restriction)//xsd:enumeration[1]/@value"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <!-- the field is based on a category -->
      <xsl:when test="contains($type, 'category')">
        <xsl:variable name="categories" select="script:GetKeywords(string($elementName), string($SchemaURI))"/>
        <!-- check whether the keyword is still valid -->
        <xsl:variable name="is-valid">
          <xsl:value-of select="boolean($categories/tcm:ListItems//tcm:Item/@Title=$original_value)"/>
        </xsl:variable>
        <xsl:if test="$debug">
          <xsl:comment>
            is valid: <xsl:value-of select="$is-valid"/>
          </xsl:comment>
        </xsl:if>
        <xsl:choose>
          <!-- if the keyword is valid, use the original value -->
          <xsl:when test="$is-valid='true'">
            <xsl:value-of select="$original_value/text()"/>
          </xsl:when>
          <!-- the keyword is not valid, so check for the context value -->
          <xsl:otherwise>
            <xsl:choose>
              <!-- if the context value is present, use it -->
              <xsl:when test="$context_value!=''">
                <xsl:value-of select="$context_value"/>
              </xsl:when>
              <!-- otherwise, get the first keyword of the category instead -->
              <xsl:otherwise>
                <xsl:value-of select="$categories/tcm:ListItems/tcm:Item/@Title"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <xsl:otherwise/>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>