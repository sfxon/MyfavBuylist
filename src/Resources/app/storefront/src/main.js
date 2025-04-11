import MyfavBuylistPlugin from './myfav-buylist-plugin/myfav-buylist-plugin.plugin';

// Register plugin via the existing PluginManager
const PluginManager = window.PluginManager;
PluginManager.register('MyfavBuylistPlugin', MyfavBuylistPlugin, '[myfav-buylist-plugin]');