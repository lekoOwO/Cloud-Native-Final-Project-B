FROM grafana/grafana-oss

WORKDIR /var/lib/grafana

RUN mkdir data
COPY dashboards dashboards
COPY provisioning /etc/grafana/provisioning