<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tcm="http://www.tridion.com/ContentManager/5.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tcmi="http://www.tridion.com/ContentManager/5.0/Instance" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:script="urn:script" exclude-result-prefixes="msxsl xsd tcmi">
   <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
  <xsl:param name="SchemaURI">this is the default value of SchemaURI in the XSLT</xsl:param>
  <xsl:variable name="schemaContainer" select="document($SchemaURI)/SchemaContainer"/>
  <xsl:variable name="rootelementname" select="$schemaContainer/xsd:schema/@RootElementName"/>
  <xsl:variable name="categoryFieldsEnums" select="$schemaContainer/CategoryFieldsEnums"/>
  <xsl:variable name="SchemaFields" select="$schemaContainer/xsd:schema/xsd:element[@name=$rootelementname]"/>
  <xsl:variable name="MetadataFields" select="$schemaContainer/xsd:schema/xsd:element[@name='Metadata']"/>
  <xsl:variable name="namespace" select="$schemaContainer/xsd:schema/@targetNamespace"/>
  <xsl:variable name="CompDoc" select="/"/>
  <xsl:template match="/">
  <!-- TODO - remove a lot of these "debugging" messages -->
  <xsl:message>$SchemaURI: <xsl:value-of select="$SchemaURI"/></xsl:message>
  <xsl:message>$schemaContainer: <xsl:value-of select="boolean($schemaContainer)"/></xsl:message>
  <xsl:message>$rootElementName: <xsl:value-of select="$rootelementname"/></xsl:message>
  <xsl:message>$namespace: <xsl:value-of select="$namespace"/></xsl:message>
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
               <xsl:if test="$MetadataFields/xsd:complexType/xsd:sequence/xsd:element">
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
      <xsl:variable name="currentXSDelement" select="."/>
      <xsl:variable name="type" select="@type"/>      
      <xsl:variable name="restriction" select="xsd:simpleType/xsd:restriction"/>
      <!-- Check if we have this field in the content -->
      <xsl:variable name="elementName" select="@name"/>
      <xsl:if test="true()">
         <xsl:message>elementName: <xsl:value-of select="$elementName"/></xsl:message>
         <xsl:message>startFields: <xsl:value-of select="$startFields/*[local-name() = $elementName]" />: <xsl:value-of select="boolean($startFields/*[local-name() = $elementName])"/></xsl:message>
         <xsl:message>contextFields: <xsl:value-of select="$contextFields/*[local-name()=$elementName]" />: <xsl:value-of select="boolean($contextFields/*[local-name()=$elementName])"/></xsl:message>
      </xsl:if>
      <xsl:choose>
         <xsl:when test="xsd:annotation/xsd:appinfo/tcm:EmbeddedSchema">
            <!-- When the field is an embedded field call the same template again -->
            <xsl:variable name="embeddedSchemaFields" select="document(xsd:annotation/xsd:appinfo/tcm:EmbeddedSchema/@xlink:href)/SchemaContainer/xsd:schema"/>
            <xsl:message>embeddedSchemaFields: <xsl:value-of select ="$embeddedSchemaFields"/></xsl:message>
            <xsl:variable name="categoryFieldsEnums" select="document(xsd:annotation/xsd:appinfo/tcm:EmbeddedSchema/@xlink:href)/SchemaContainer/CategoryFieldsEnums"/>
            <xsl:variable name="embeddedTreeFragment">
                  <xsl:choose>
                     <!-- If we have existing content -->
                     <xsl:when test="$startFields/*[local-name() = $elementName][node()]">
                        <xsl:for-each select="$startFields/*[local-name() = $elementName]">
                           <xsl:element name="{$elementName}" namespace="{$namespace}">
                              <xsl:variable name="currentSourceField" select="current()"/>
                              <xsl:message>About to loop the children of <xsl:value-of select="$currentSourceField"/></xsl:message>
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
            <xsl:for-each select="$contextFields/*[local-name()=$elementName][@overrule='true'][text()]">
               <xsl:element name="{$elementName}" namespace="{$namespace}">
                  <xsl:choose>
                     <xsl:when test="$currentXSDelement/@type='tcmi:SimpleLink'">
                        <xsl:attribute name="xlink:href"><xsl:value-of select="text()"/></xsl:attribute>
                        <xsl:attribute name="xlink:title">dummy_title<!--<xsl:value-of select="document(concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title))"/>--></xsl:attribute>
                     </xsl:when>
                     <xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
                  </xsl:choose>
               </xsl:element>
            </xsl:for-each>
         </xsl:when>
         <!-- Use existing values if existent -->
         <xsl:when test="$startFields/*[local-name() = $elementName]">
            <xsl:choose>
               <!-- if the field contains a enumeration or category, check if it still exists -->
               <xsl:when test="$restriction/xsd:enumeration/@value!='' or contains($type, 'category')">
                  
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
                  <xsl:for-each select="$startFields/*[local-name() = $elementName][.//node() | @xlink:href]"><!-- [.//text() | @xlink:href] -->
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
            <!-- normale xsd elements -->
            <xsl:for-each select="$contextFields/*[local-name()=$elementName][normalize-space(text())]">
                  <xsl:element name="{$elementName}" namespace="{$namespace}">
                     <xsl:choose>
                        <xsl:when test="$currentXSDelement/@type='tcmi:SimpleLink'">
                           <xsl:attribute name="xlink:href"><xsl:value-of select="text()"/></xsl:attribute>
                           <xsl:attribute name="xlink:title">dummy_title<!--<xsl:value-of select="document(concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title))"/>--></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
                     </xsl:choose>
                  </xsl:element>
            </xsl:for-each>
         </xsl:when>
         <!-- When overrule is false, and there are no existing values -->
         <xsl:when test="$contextFields/*[local-name()=$elementName]">
            <xsl:for-each select="$contextFields/*[local-name()=$elementName][normalize-space(text())!='']">
                  <xsl:element name="{$elementName}" namespace="{$namespace}">
                     <xsl:choose>
                        <xsl:when test="$currentXSDelement/@type='tcmi:SimpleLink'">
                           <xsl:attribute name="xlink:href"><xsl:value-of select="text()"/></xsl:attribute>
                           <xsl:attribute name="xlink:title">dummy_title<!--<xsl:value-of select="document(concat($SHOW_XML_FILE, ./tcm:Component/tcm:Data/tcm:Title))"/>--></xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
                     </xsl:choose>
                  </xsl:element>
            </xsl:for-each>
         </xsl:when>         
         <xsl:otherwise>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <xsl:template match="*">
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
      <xsl:choose>
         <!-- the field has a restriction, there are several enumeration values -->
         <xsl:when test="$restriction">
            <!-- check whether the current enumeration value is still valid -->
            <xsl:variable name="is-valid">
               <xsl:value-of select="boolean(msxsl:node-set($restriction)//xsd:enumeration/@value=$original_value)"/>
            </xsl:variable>
            <xsl:choose>
               <!-- if the enumeration is valid, use the original value -->
               <xsl:when test="$is-valid='true'"><xsl:value-of select="$original_value/text()"/></xsl:when>
               <!-- the enumeration is not valid, so check for the context value -->
               <xsl:otherwise>
                  <xsl:choose>
                     <!-- if the context value is present, use it -->
                     <xsl:when test="$context_value!=''"><xsl:value-of select="$context_value"/></xsl:when>
                     <!-- otherwise, get the first value of the enumeration instead -->
                     <xsl:otherwise><xsl:value-of select="msxsl:node-set($restriction)//xsd:enumeration[1]/@value"/></xsl:otherwise>
                  </xsl:choose>
               </xsl:otherwise>
            </xsl:choose>
         </xsl:when>
         <!-- the field is based on a category -->
         <xsl:when test="contains($type, 'category')">         
           <!--<xsl:variable name="categories" select="script:GetKeywords(string($elementName), string($SchemaURI))"/>-->
           <xsl:variable name ="category" select="$categoryFieldsEnums/tcm:ListKeywords[@FieldName=$elementName]"/>
           <xsl:if test ="not($category)"><xsl:message>Unable to find category for field: <xsl:value-of select="$elementName"/></xsl:message></xsl:if>
           <xsl:variable name="originalKeyword" select="$category/tcm:Item[@Title=$original_value]"/>
            <!-- check whether the keyword is still valid -->
            <xsl:choose>
               <!-- if the keyword is valid, use the original value -->
               <xsl:when test="$originalKeyword"><xsl:value-of select="$originalKeyword/@Title"/></xsl:when>
               <!-- the keyword is not valid, so check for the context value -->
               <xsl:otherwise>
                  <xsl:choose>
                     <!-- if the context value is present, use it -->
                     <xsl:when test="$context_value!=''"><xsl:value-of select="$context_value"/></xsl:when>
                     <!-- otherwise, get the first keyword of the category instead -->
                     <xsl:otherwise><xsl:value-of select="$category/tcm:Item/@Title"/></xsl:otherwise>
                  </xsl:choose>
               </xsl:otherwise>
            </xsl:choose>            
         </xsl:when>
         <xsl:otherwise/>
      </xsl:choose>
   </xsl:template> 
</xsl:stylesheet>
