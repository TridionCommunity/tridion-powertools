using System.Linq;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using PowerTools.Common.Handlers.Model;

namespace PowerTools.Common.Handlers
{

    class WordHelper
    {
        private const string TEXT_YES = "Yes";
        private const string TEXT_NO = "No";
        private const string TEXT_METADATA = "Metadata";
        private const string TEXT_SCHEMA = " Schema";


        public byte[] CreateWordDocument(Schema schemaData, string templateLocation)
        {

            byte[] binFile = null;


            byte[] byteArray = File.ReadAllBytes(templateLocation);
            using (MemoryStream mem = new MemoryStream())
            {
                mem.Write(byteArray, 0, (int) byteArray.Length);

                using (WordprocessingDocument doc = WordprocessingDocument.Open(mem, true))
                {
                    Table table = doc.MainDocumentPart.Document.Body.GetFirstChild<Table>();

                    RunFonts textFonts =
                        table.GetFirstChild<TableRow>().GetFirstChild<TableCell>().GetFirstChild<Paragraph>().
                            GetFirstChild<ParagraphProperties>().GetFirstChild<ParagraphMarkRunProperties>().
                            GetFirstChild<RunFonts>();
                    string paragraphPropertiesOuterXml = getParagraphPropertiesXml(textFonts);
                    string runPropertiesOuterXml = getRunPropertiesXml(textFonts);


                    table.Elements<TableRow>().ElementAt(0).Elements<TableCell>().ElementAt(1).Elements<Paragraph>().ElementAt(0).Append(new Run(new RunProperties(runPropertiesOuterXml), new Text(schemaData.Title)));
                    table.Elements<TableRow>().ElementAt(1).Elements<TableCell>().ElementAt(1).Elements<Paragraph>().ElementAt(0).Append(new Run(new RunProperties(runPropertiesOuterXml), new Text(schemaData.Description)));
                    table.Elements<TableRow>().ElementAt(2).Elements<TableCell>().ElementAt(1).Elements<Paragraph>().ElementAt(0).Append(new Run(new RunProperties(runPropertiesOuterXml), new Text(schemaData.SchemaType + TEXT_SCHEMA)));
                    table.Elements<TableRow>().ElementAt(3).Elements<TableCell>().ElementAt(1).Elements<Paragraph>().ElementAt(0).Append(new Run(new RunProperties(runPropertiesOuterXml), new Text(schemaData.RootElementName)));
                    table.Elements<TableRow>().ElementAt(4).Elements<TableCell>().ElementAt(1).Elements<Paragraph>().ElementAt(0).Append(new Run(new RunProperties(runPropertiesOuterXml), new Text(schemaData.NamespaceUri)));


                    // Save properties for metadata row
                    TableRowProperties metaDataRowProperties =
                        table.Elements<TableRow>().ElementAt(5).GetFirstChild<TableRowProperties>();
                    TableCellProperties metaDataCellProperties =
                        table.Elements<TableRow>().ElementAt(5).GetFirstChild<TableCell>().GetFirstChild<TableCellProperties>();
                    ParagraphProperties metaDataParagraphProperties =
                        table.Elements<TableRow>().ElementAt(5).GetFirstChild<TableCell>().GetFirstChild<Paragraph>().GetFirstChild<ParagraphProperties>();
                    RunProperties metaDataRunProperties =
                        table.Elements<TableRow>().ElementAt(5).GetFirstChild<TableCell>().GetFirstChild<Paragraph>().GetFirstChild<Run>().GetFirstChild<RunProperties>();


                    // Clear empty rows
                    foreach (TableRow row in table.Elements<TableRow>())
                    {
                        Text text = row.Elements<TableCell>().ElementAt(1).GetFirstChild<Paragraph>().GetFirstChild<Run>().GetFirstChild<Text>();

                        if (string.IsNullOrEmpty(text.InnerText.Trim()))
                        {
                            table.RemoveChild(row);
                        }
                    }

                    foreach (SchemaField field in schemaData.Fields)
                    {
                        TableRow tr = new TableRow();

                        TableCell tc1 = new TableCell();
                        tc1.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.Description))));
                        tr.Append(tc1);

                        TableCell tc2 = new TableCell();
                        tc2.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.XmlName))));
                        tr.Append(tc2);

                        TableCell tc3 = new TableCell();
                        tc3.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.FieldType))));
                        tr.Append(tc3);

                        TableCell tc4 = new TableCell();
                        tc4.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text((field.Required) ? TEXT_YES : TEXT_NO))));
                        tr.Append(tc4);

                        TableCell tc5 = new TableCell();
                        tc5.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text((field.MultiValue) ? TEXT_YES : TEXT_NO))));
                        tr.Append(tc5);

                        TableCell tc6 = new TableCell();
                        tc6.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.Properties))));
                        tr.Append(tc6);

                        table.Append(tr);
                    }


                    if (schemaData.MetadataFields.Count > 0 && schemaData.SchemaType == "Component")
                    {
                        TableRow tr = new TableRow();
                        TableCell tc = new TableCell();
                        TableCellProperties tcProperties = new TableCellProperties(metaDataCellProperties.OuterXml);
                        GridSpan gridSpan = new GridSpan(){ Val = 6 };
                        tcProperties.Append(gridSpan);

                        tr.Append(new TableRowProperties(metaDataRowProperties.OuterXml));
                        tc.Append(tcProperties);
                        tc.Append(new Paragraph(new ParagraphProperties(metaDataParagraphProperties.OuterXml), new Run(new RunProperties(metaDataRunProperties.OuterXml), new Text(TEXT_METADATA))));
                        tr.Append(tc);
                        table.Append(tr);

                    }


                    foreach (SchemaField field in schemaData.MetadataFields)
                    {
                        TableRow tr = new TableRow();

                        TableCell tc1 = new TableCell();
                        tc1.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.Description))));
                        tr.Append(tc1);

                        TableCell tc2 = new TableCell();
                        tc2.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.XmlName))));
                        tr.Append(tc2);

                        TableCell tc3 = new TableCell();
                        tc3.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.FieldType))));
                        tr.Append(tc3);

                        TableCell tc4 = new TableCell();
                        tc4.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text((field.Required) ? TEXT_YES : TEXT_NO))));
                        tr.Append(tc4);

                        TableCell tc5 = new TableCell();
                        tc5.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text((field.MultiValue) ? TEXT_YES : TEXT_NO))));
                        tr.Append(tc5);

                        TableCell tc6 = new TableCell();
                        tc6.Append(new Paragraph(new ParagraphProperties(paragraphPropertiesOuterXml), new Run(new RunProperties(runPropertiesOuterXml), new Text(field.Properties))));
                        tr.Append(tc6);

                        table.Append(tr);
                    }
                }

                binFile = mem.ToArray();
            }

            return binFile;
        }
      

        private string getParagraphPropertiesXml(RunFonts textFonts)
        {

            ParagraphProperties paragraphProperties = new ParagraphProperties();

            ParagraphStyleId paragraphStyleId = new ParagraphStyleId() { Val = "Tabletext" };
            SpacingBetweenLines betweenLines = new SpacingBetweenLines() { Before = "100", BeforeAutoSpacing = true, After = "100", AfterAutoSpacing = true };

            ParagraphMarkRunProperties paragraphMarkRunProperties = new ParagraphMarkRunProperties();

            RunFonts paragraphRunFonts = getFonts(textFonts);
            
            Color color = new Color() { Val = "auto" };

            paragraphMarkRunProperties.Append(paragraphRunFonts);
            paragraphMarkRunProperties.Append(color);

            Justification justification1 = new Justification() { Val = JustificationValues.Left };

            paragraphProperties.Append(justification1);
            paragraphProperties.Append(paragraphStyleId);
            paragraphProperties.Append(betweenLines);
            paragraphProperties.Append(paragraphMarkRunProperties);

            return paragraphProperties.OuterXml;
        }

        private string getRunPropertiesXml(RunFonts textFonts)
        {
            RunProperties runProperties = new RunProperties();
            RunFonts runParagraphRunFonts = getFonts(textFonts);
            Color color = new Color() { Val = "auto" };
            FontSizeComplexScript fontSizeComplexScript = new FontSizeComplexScript() { Val = "20" };

            runProperties.Append(runParagraphRunFonts);
            runProperties.Append(color);
            runProperties.Append(fontSizeComplexScript);

            return runProperties.OuterXml;
        }

        private RunFonts getFonts(RunFonts textFonts)
        {
            return new RunFonts()
            {
                Ascii = textFonts.Ascii,
                AsciiTheme = textFonts.AsciiTheme,
                EastAsia = textFonts.EastAsia,
                EastAsiaTheme = textFonts.EastAsiaTheme,
                HighAnsi = textFonts.HighAnsi,
                HighAnsiTheme = textFonts.HighAnsiTheme
            };
        }
    }
}
