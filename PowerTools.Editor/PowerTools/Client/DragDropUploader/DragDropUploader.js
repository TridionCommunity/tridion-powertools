///DragDropUploader version 0.1

$evt.addEventHandler($display, "start", onDisplayStarted);

function onDisplayStarted() {
    //IE does not support drag and drop and multiple file selection (yet)     
    if ($dom.isIE) {
        return;
    }

    var toolbar = $controls.getControl($("#DashboardToolbar"), "Tridion.Controls.RibbonToolbar");
    var page = toolbar.getPage("DashboardPage");
    //Initialize the DragAndDropUploader after the frame has loaded
    $evt.addEventHandler(page, "frameloaded", _onTridionDashboardFrameLoaded);
}

function _onTridionDashboardFrameLoaded() {
    var ddUploader = new PowerTools.AddOns.DragDropUploader.Base();
    ddUploader.initialize();
}

Type.registerNamespace("PowerTools.AddOns.DragDropUploader");
PowerTools.AddOns.DragDropUploader.Base = function () {
    
    console.log("Initializing DragDropUploader...");    
    Type.enableInterface(this, "PowerTools.AddOns.DragDropUploader");
    
    //var filteredList = $controls.getControl($("#FilteredDashboardList"), "Tridion.Controls.FilteredList");
    
    
    this._strings =
    {
        UrlCss: $ptUtils.expandPath("PowerTools/Client/DragDropUploader/style/style.css"),
        UrlUploadTemplate: $ptUtils.expandPath("PowerTools/Client/DragDropUploader/UploadTemplate.aspx"),
        UrlUploadHandler: $ptUtils.expandPath("PowerTools/Client/DragDropUploader/filetransfer.ashx"),
        MessageSuccess: "Successfully uploaded {0} {1}",
        MessagePartlySuccess: "Uploaded {0} {1}. Number of failures: {2}. {3}",
        MessageError: "Uploading files went wrong",
        MessageFailureDetails: "The following files failed to upload",
        MessageSelectSchema: "Please select a schema first",
        MessageProgress: "Uploading {0} {1}...",
        MessageTitle: "Uploading files",
        Files: "files",
        File: "file"
    };

    this._controls =
    {
        SchemaControl: null
    };
   
    this.initialize = function () {
        var context = this;

        //Load style
        $j.get(context._strings.UrlCss, function (css) {
            $j('<style type="text/css"></style>')
              .html(css)
              .appendTo("head");
        });

        //Add upload template to the DOM
        context._appendUploadTemplate();
        //Initialize the schema control
        context._initSchemaDropDown();
        context._initUploadArea();
        context._initMinMaxButton();

    };

    this._appendUploadTemplate = function () {
        //Load and append the upload-html to the FilteredDashboardList       
        var urlToUploadHtml = this._strings.UrlUploadTemplate;
        var template = PowerTools.Utilities.prototype.getTemplate(urlToUploadHtml);
        $j("#FilteredDashboardList").append(template);
    };

    this._initSchemaDropDown = function () {

        var context = this;
        this._controls.SchemaControl = $controls.getControl($("#SchemaDropDownForDdu"), "Tridion.Controls.Dropdown");

        //Load Multimedia schema dropdown
        $evt.addEventHandler(this._controls.SchemaControl, "loadcontent",
        function () {
            var folder = $models.getItem($url.getHashParam("locationId"));
            var publication = folder.getPublication();
            var schemaList = publication.getListSchemas($const.SchemaPurpose.MULTIMEDIA);

            if (schemaList) {
                var schemaListLoaded = function () {
                    $evt.removeEventHandler(schemaList, "load", schemaListLoaded);
                    context._controls.SchemaControl.setContent(schemaList.getXml());
                };

                if (schemaList.isLoaded(true)) {
                    schemaListLoaded();
                }
                else {
                    $evt.addEventHandler(schemaList, "load", schemaListLoaded);
                    schemaList.load();
                }
            }
        });



    };

    this._initUploadArea = function () {

        var context = this;
        var postUrl = this._strings.UrlUploadHandler;      
        $j(function () {
            var msg = null;
            $j('#fileupload').fileupload({
                dataType: 'json',
                url: postUrl,
                singleFileUploads: false,
                done: function (e, data) {
                    msg.finish();
                    var success = [];
                    var fail = [];
                    $j.each(data.result, function (index, file) {
                        //console.log(file);
                        if (file.uploadSuccess) {
                            success.push(file);
                        } else {
                            fail.push(file);
                        }
                    });

                    if (fail.length == 0) {
                        $messages.registerGoal(context._strings.MessageSuccess.format(data.files.length, (data.files.length > 1 ? "files" : "file")), null, false, false);
                    } else {
                        var failedMessage = context._strings.MessageFailureDetails + ": \n\r"
                        for (var i = 0, k = fail.length; i < k; i++) {
                            failedMessage += "-> {0}".format(fail[i].name)
                            if (i < (k - 1)) {
                                failedMessage += "\n\r ";
                            }
                        }
                        $messages.registerNotification(context._strings.MessagePartlySuccess.format(data.files.length - fail.length, (data.files.length > 1 ? "file(s)" : "file"), fail.length, failedMessage), null, false, false);

                    }
                    //Only refresh if the current view is the orgitem-view the files were uploade to
                    if (data.formData.orgItemId == $url.getHashParam("locationId")) {
                        $display.getView().refreshList();
                    }
                },
                dragover: function (e) {
                    var dropZone = $j('#fileupload'),
                        timeout = window.dropZoneTimeout;
                    if (!timeout) {
                        dropZone.addClass('in');
                    } else {
                        clearTimeout(timeout);
                    }
                    if (e.target === dropZone[0]) {
                        dropZone.addClass('hover');
                    } else {
                        dropZone.removeClass('hover');
                    }
                    window.dropZoneTimeout = setTimeout(function () {
                        window.dropZoneTimeout = null;
                        dropZone.removeClass('in hover');
                    }, 100);
                },
                fail: function (e, data) {
                    msg.finish();
                    $messages.registerError(this._strings.MessageError);
                },
                drop: function (e, data) {
                    //if no schema is selected, don't upload anything. 
                    //Schema check may not be needed in the future. (eg: uploading pages, keywords, etc)
                    if (!context._controls.SchemaControl.getValue()) {
                        $messages.registerError(context._strings.MessageSelectSchema);
                        return false;
                    }
                },
                submit: function (e, data) {
                    //Append shemaUri and orgitemId to the post-data
                    data.formData = { orgItemId: $url.getHashParam("locationId"), schemaId: context._controls.SchemaControl.getValue() };
                    msg = $messages.registerProgress(context._strings.MessageProgress.format(data.files.length, (data.files.length > 1 ? context._strings.Files : context._strings.File)), context._strings.MessageTitle, false, false, false);
                }
            });
        });


    };

    //Add eventhandler to minmax button click
    this._initMinMaxButton = function () {
        $j("#minmax").live("click", function () {
            $j("#fileupload").slideToggle("slow", function () {
                if ($j(this).is(":visible")) {
                    $j("#minmax").css("bottom", "103px");
                } else {
                    $j("#minmax").css("bottom", "1px");
                }
            });
        });
    };



};

