FROM reactnativecommunity/react-native-android:latest

# install nodejs using n
# install nodejs and yarn packages from nodesource
# RUN curl -L https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo bash - && apt-get install -qq -y --no-install-recommends nodejs
# ADD https://services.gradle.org/distributions/gradle-8.3-all.zip /opt/
# RUN unzip /opt/gradle-8.3-all.zip -d /opt/gradle
# ENV GRADLE_HOME /opt/gradle/gradle-8.3-all.zip
# ENV PATH $GRADLE_HOME/bin:$PATH

WORKDIR /app

COPY . .


# RUN curl -L https://services.gradle.org/distributions/gradle-8.3-all.zip --output /app/android/gradle/gradle-8.3-all.zip

RUN yarn install

RUN cd android && ./gradlew clean
RUN yarn android:apk
