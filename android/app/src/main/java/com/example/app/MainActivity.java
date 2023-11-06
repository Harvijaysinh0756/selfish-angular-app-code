package com.example.app;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.KeyEvent;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

//  boolean doubleBackToExitPressedOnce = false;
//  @Override
//  public void onBackPressed() {
//    //Checking for fragment count on backstack
//    if (getSupportFragmentManager().getBackStackEntryCount() > 0) {
//      getSupportFragmentManager().popBackStack();
//    } else if (doubleBackToExitPressedOnce) {
//      this.doubleBackToExitPressedOnce = true;
//      Toast.makeText(this,"Please click BACK again to exit.", Toast.LENGTH_SHORT).show();
//
//      new Handler().postDelayed(new Runnable() {
//
//        @Override
//        public void run() {
//          doubleBackToExitPressedOnce = false;
//        }
//      }, 2000);
//    } else {
//      super.onBackPressed();
//      return;
//    }
//  }

//  private long lastPressedTime;
//  private static final int PERIOD = 2000;
//
//  @Override
//  public boolean onKeyDown(int keyCode, KeyEvent event) {
//    if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
//      switch (event.getAction()) {
//        case KeyEvent.ACTION_DOWN:
//          if (event.getDownTime() - lastPressedTime < PERIOD) {
//            finish();
//          } else {
//            super.onBackPressed();
//            Toast.makeText(getApplicationContext(), "Press again to exit.",
//              Toast.LENGTH_SHORT).show();
//            lastPressedTime = event.getEventTime();
//          }
//          return true;
//      }
//    }
//    return false;
//  }




//      this.doubleBackToExitPressedOnce = true;
//      Toast.makeText(this, "Please click BACK again to exit", Toast.LENGTH_SHORT).show();
//
//      new Handler().postDelayed(new Runnable() {
//
//        @Override
//        public void run() {
//          doubleBackToExitPressedOnce = false;
//        }
//      }, 2000);



//  @Override
//  public void onBackPressed() {
//    new AlertDialog.Builder(this).setIcon(android.R.drawable.ic_dialog_alert).setTitle("Exit")
//      .setMessage("Are you sure?")
//      .setPositiveButton("yes", new DialogInterface.OnClickListener() {
//        @Override
//        public void onClick(DialogInterface dialog, int which) {
//
//          Intent intent = new Intent(Intent.ACTION_MAIN);
//          intent.addCategory(Intent.CATEGORY_HOME);
//          intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//          startActivity(intent);
//          finish();
//        }
//      }).setNegativeButton("no", null).show();
//  }









}


