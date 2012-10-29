Type.registerNamespace("PowerTools.Commands");

/**
 * Implements the <c>ViewInFrontEnd</c> command extension
 */
function ViewInFrontEnd(settings)
{
    var FIELD_NAME = "Publishing URL";
    
    var classToBeReturned =  function() 
    {
        Type.enableInterface(this, settings.fullQName);
        this.addInterface("PowerTools.BaseCommand", [settings.className]);

        this.settings = settings;
        
        this._getUrlAndViewInFrontEnd = function(itemId) {
            var $this = this;
            $ptUtils.getStaticItem(itemId,
                function (item) //load the item info asynchronously
                {
                    var publicationId = item.getPublication().getId();
                    var frontEndUrl = $this._getFrontEndUrlBasedOnPublicationId(publicationId);
                    
                    if(!frontEndUrl) {
                        frontEndUrl =
                            publicationId in fallbackConfig
                                ? fallbackConfig[publicationId][$this.settings.targetKey]
                                : $this.settings.frontEndUrl;
                    }
                    
                    var itemXml = item.getStaticXmlDocument();
                    
                    $ptUtils.getStaticItem(publicationId, function(publication) {
            var pubLocationUrl =  _getPublishLocationUrl(itemXml);
            if($this.settings.rewriteFileExtension) {
                pubLocationUrl = pubLocationUrl.replace(new RegExp("\.[^.]*$","i"),$this.settings.rewriteFileExtension);
            }
                        window.open(frontEndUrl + pubLocationUrl);
                    });
                }, null, false);
        }

        function _getPublishLocationUrl(itemXml) {
            return $xml.getInnerText(itemXml, "//tcm:Info/tcm:LocationInfo/tcm:PublishLocationUrl");
        }

        this._getFrontEndUrlBasedOnPublicationId = function (pubId) {
            if(this.configClient) {
                return _getPreviewUrlFromConfiguration(
                    $($j.parseXML(this.configClient.getValue(FIELD_NAME))),
                    pubId,
                    this.settings.targetKey);
            }
            
            return null; //Get the URL from XML based on Publication ID
        }
    }
    
    classToBeReturned.prototype.isValidSelection = function(selection, pipeline) 
    {
        var items = selection.getItems();

        if (items.length != 1) 
        {
            return false;
        }

        var itemId = selection.getItem(0);
        var item = $models.getItem(itemId);

        if (!item || item.getItemType() != $const.ItemType.PAGE)
        {
            return false;
        }

        if (pipeline) 
        {
            pipeline.stop = false;
        }
        return true;
    };

    classToBeReturned.prototype._execute = function(selection, pipeline) 
    {
        var itemId = selection.getItem(0);

        if (itemId)
        {
            this._getUrlAndViewInFrontEnd(itemId)
        }

        if (pipeline) 
        {
            pipeline.stop = false;
        }
    };
    
    /**
     * Finds URL value in the configuration component XML.
     */
    function _getPreviewUrlFromConfiguration($cfg, publication, target) 
    {
        return $cfg
            .find('publications:has(name:contains(' + publication + '))')
            .find('targets:has(name:contains(' + target + '))')
            .find('url')
            .attr('xlink:href');
    }
    
    return classToBeReturned;
};

var fallbackConfig = {
    'tcm:0-7-1': { live: 'http://www.TridionPowerTools.com', staging: 'http://siteedit.TridionPowerTools.com/SiteEdit/#' }
};


PowerTools.Commands.ViewInStaging = ViewInFrontEnd({
    fullQName: "PowerTools.Commands.ViewInStaging",
    className: "ViewInStaging",
    frontEndUrl: "http://staging.frontend.com",
    targetKey: 'staging'
});

PowerTools.Commands.ViewInLive = ViewInFrontEnd({
    fullQName: "PowerTools.Commands.ViewInLive",
    className: "ViewInLive",
    frontEndUrl: "http://www.frontend.com",
    targetKey: 'live'
});
