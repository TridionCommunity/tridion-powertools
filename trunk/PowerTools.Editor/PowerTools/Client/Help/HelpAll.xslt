<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
>
    <xsl:output method="xml" omit-xml-declaration="yes" indent="yes"/>

    <xsl:template match="/*">
        <div id="toc">
        <xsl:for-each select="tool/@name">
            <xsl:variable name="toolname" select="."/>
            <a href="#{$toolname}">
                <xsl:value-of select="$toolname"/>
                <img src="{$toolname}_16.png"/>
            </a>
        </xsl:for-each>
        </div>
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>       
    </xsl:template>
    
    <xsl:template match="/help/*">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template name="tool">
        <xsl:param name="toolname">generic</xsl:param>

    </xsl:template>

    <xsl:template match="//@name">
        <h2>
            <xsl:attribute name="id">
                <xsl:value-of select="."/>
            </xsl:attribute>
            <xsl:value-of select="."/>
        </h2>
    </xsl:template>

    <xsl:template match="instructions|credits">
        <div>
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="*">
        <xsl:element name="{local-name()}">
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
</xsl:stylesheet>
