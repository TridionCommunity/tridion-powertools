<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tcm="http://www.tridion.com/ContentManager/5.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tcmi="http://www.tridion.com/ContentManager/5.0/Instance" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:script="urn:script" exclude-result-prefixes="msxsl xsd tcmi">
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>
  <xsl:param name="SchemaURI">this is the default value of SchemaURI in the XSLT</xsl:param>
  <xsl:variable name="schemaContainer" select="document($SchemaURI)/SchemaContainer"/>
  <xsl:variable name="rootelementname" select="$schemaContainer/xsd:schema/@RootElementName"/>
  <!-- REFACTOR really! - do the field enums from the resolver - far more of this from the resolver -->
  <xsl:variable name="categoryFieldsEnums" select="$schemaContainer/CategoryFieldsEnums"/>
  <xsl:variable name="SchemaFields" select="$schemaContainer/xsd:schema/xsd:element[@name=$rootelementname]"/>
  <xsl:variable name="MetadataFields" select="$schemaContainer/xsd:schema/xsd:element[@name='Metadata']"/>
  <xsl:variable name="namespace" select="$schemaContainer/xsd:schema/@targetNamespace"/>
  <xsl:variable name="CompDoc" select="/Compound"/>
  <xsl:template match="/">
    <xsl:value-of select="$SchemaURI"/>
  </xsl:template>
</xsl:stylesheet>