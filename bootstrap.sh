#!/usr/bin/env bash

worker_options=(
"Enable workers.dev Domain           (Default: False)" "" "OFF"
"Enable NSFW avatar image checking   (Default: False)" "" "OFF"
"Enable explicit word checking       (Default: True)" "" "ON"
"Enable Data Validation              (Default: True)" "" "ON"
"Enable Data History                 (Default: False)" "" "OFF"
)

selected=$(whiptail --title "Enable Features For The Service Worker" --checklist \
"Choose options using spacebar to select and enter to confirm" 20 78 10 \
"${worker_options[@]}" 3>&1 1>&2 2>&3)

exitstatus=$?
if [ $exitstatus = 0 ]; then
  echo "Selected options are: $selected"
else
  echo "No options selected."
fi

exit

source loaders.sh
trap BLA::stop_loading_animation SIGINT
clear
echo "Checking System..."

#BLA::start_loading_animation "${BLA_modern_metro[@]}"
  if command -v node > /dev/null 2>&1; then
      NODE_VERSION=$(node -v | sed 's/v//')
      REQUIRED_NODE_VERSION=18
      if [[ $(echo "$NODE_VERSION >= $REQUIRED_NODE_VERSION" | bc -l) -eq 1 ]]; then
          echo "Nodejs Installed: $NODE_VERSION"
      else
          echo "Nodejs Installed: $NODE_VERSION" # Your node version is below what is recommended. you may not have expected functionality"
      fi
  else
      echo "Nodejs Not Found"
  fi
  if command -v npx > /dev/null 2>&1; then
      NPM_VERSION=$(npx -v | sed 's/v//')
      echo "npx Installed:    $NPM_VERSION"
  else
      echo "npx Not Found."
  fi
  #if command -v pnpm &> /dev/null; then
  #    PNPM_VERSION=$(pnpm -v | sed 's/v//')
  #    echo "pnpm Installed: $PNPM_VERSION"
  #else
  #    echo "pnpm is not installed."
  #fi

#BLA::stop_loading_animation

clear
echo "Enable/Disable Features for your dashboard"
echo "###########################################################"
echo 
echo "###########################################################"



echo "What is the name of your dashboard? This will be used for project names."
printf ">> "
read -r PROJECT_NAME
echo "What is the domain of your dashboard? (Web Frontend)"
printf ">> "
read -r PAGES_URL
echo "What is the domain of your api? (Service Worker)"
printf ">> "
read -r WORKER_URL
echo "What is the domain of your Logto Instance?"
printf ">> "
read -r LOGTO_ROOT

echo "Next we will now configure the worker."

echo "1. Do you want to enable a workers.dev domain for your worker?  (yes/NO)"
printf ">> "
read -r ENABLE_WORKERS_DEV
ENABLE_WORKERS_DEV=${ENABLE_WORKERS_DEV:-0}

echo "2. Do you want to enable nsfw avatar checking?                  (yes/NO)"
printf ">> "
read -r ENABLE_NSFW_CHECK
ENABLE_NSFW_CHECK=${ENABLE_NSFW_CHECK:-0}
if [[ $ENABLE_NSFW_CHECK == 'yes' ]]; then
  echo "2.a What is the domain of your avatar service? Find out more here: https://github.com/t2vee/nsfwjs-avatar-service"
  printf ">> "
  read -r AVATAR_API_URI
fi

echo "3. Do you want to enable explicit word filtering?               (yes/NO)"
printf ">> "
read -r ENABLE_BAD_WORDS_CHECK
ENABLE_BAD_WORDS_CHECK=${ENABLE_BAD_WORDS_CHECK:-0}

echo "4. Do you want to enable Data Validation?                       (YES/no)"
printf ">> "
read -r ENABLE_DATA_VALIDATION
ENABLE_DATA_VALIDATION=${ENABLE_DATA_VALIDATION:-1}

echo "5. Do you want to enable Data History?                          (YES/no)"
printf ">> "
read -r ENABLE_DATA_HISTORY
ENABLE_DATA_HISTORY=${ENABLE_DATA_HISTORY:-1}

echo "You will need to have a M2M application created in logto for the next step"

echo "6. What is your Logto M2M App ID?"
printf ">> "
read -r LOGTO_WORKER_APP_ID

echo "7. What is your Logto M2M App Secret?"
printf ">> "
read -r LOGTO_WORKER_APP_SECRET

echo "Next we will now configure the dashboard."

echo "1. Do you want to enable Matomo Analytics?                      (yes/NO)"
printf ">> "
read -r ENABLE_MATOMO
ENABLE_MATOMO=${ENABLE_MATOMO:-0}
if [[ $ENABLE_MATOMO == 'yes' ]]; then
  echo "1.a What is the domain of your matomo instance?"
  printf ">> "
  read -r MATOMO_URI
  echo "1.b What is the site id of your configured site?"
  printf ">> "
  read -r MATOMO_SITE_ID
fi

echo "2. Do you want to enable username change time limits?           (yes/NO)"
printf ">> "
read -r ENABLE_USERNAME_CHANGE_LIMITS
ENABLE_USERNAME_CHANGE_LIMITS=${ENABLE_USERNAME_CHANGE_LIMITS:-0}

echo "3. Do you want to enable login verification by default?         (yes/NO)"
printf ">> "
read -r ENABLE_LOGIN_VERIFICATION_DEFAULT
ENABLE_LOGIN_VERIFICATION_DEFAULT=${ENABLE_LOGIN_VERIFICATION_DEFAULT:-0}

echo "4. What is the contact email for your dashboard? This will be displayed in the footer"
printf ">> "
read -r SUPPORT_EMAIL

echo "5. What is the url of your privacy policy?"
printf ">> "
read -r PRIVACY_POLICY_URL

echo "You will need to have a SPA application created in logto for the next step"

echo "6. What is your Logto SPA App ID?"
printf ">> "
read -r LOGTO_WEB_APP_ID