package com.bookngogo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnative_stripeterminal.RNStripeTerminalPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.invertase.firebase.RNFirebasePackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import cl.json.RNSharePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.horcrux.svg.SvgPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.links.RNFirebaseLinksPackage;

import java.util.Arrays;
import java.util.List;

import com.airbnb.android.react.maps.MapsPackage;
//import co.apptailor.googlesignin.RNGoogleSigninPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new DocumentPickerPackage(),
            new ImagePickerPackage(),
            new NetInfoPackage(),
            new RNStripeTerminalPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNFirebasePackage(),
            new RNGoogleSigninPackage(),
            new RNSharePackage(),
            new PickerPackage(),
            new RNCWebViewPackage(),
            new SvgPackage(),
            new VectorIconsPackage(),
            new RNLocalizePackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new MapsPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNGooglePlacesPackage(),
            new RNFirebaseLinksPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
