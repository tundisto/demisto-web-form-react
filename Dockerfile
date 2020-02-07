# Create a container: docker create -p 4001:4001 --name demisto-web-form-react tundisto/demisto-web-form-react:latest
# Start the conatiner: docker start demisto-web-form-react
# Stop the container: docker stop demisto-web-form-react
# Run a temporary container: docker run -p 4001:4001 -ti --rm tundisto/demisto-web-form-react:latest

FROM node:latest
ENV DESTDIR /opt/demisto/demisto-web-form-react
WORKDIR $DESTDIR
ARG IMPORTER_DEBUG
EXPOSE 4001/tcp

COPY build/ ${DESTDIR}/build/
COPY server/ ${DESTDIR}/server/
COPY package.json ${DESTDIR}/package.json

RUN \
cd ${DESTDIR} \
&& npm install

WORKDIR ${DESTDIR}/server/src
CMD ["/bin/sh", "-c", "node server.js"]