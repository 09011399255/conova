from .serializers import (FloorSerializer, WorkspaceSerializer)
from .models import (Floor, Workspace,)
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework import viewsets

class WorkspaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows workspaces to be viewed or edited.
    
    - **List**: Returns all workspaces
    - **Create**: Adds a new workspace with availability
    - **Retrieve**: Gets a workspace and its schedule
    """
    
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    
class FloorViewset(viewsets.ModelViewSet):
    """
    API  endpoint that allows floors to be viewed or edited.
    
    - **List**: Returns all floors for a particular workspace
    - **Create**: Adds a new to floor to a workspace
    - **Retrieve**: Gets a floor under a particular workspace
    """
    
    queryset = Floor.objects.all()
    serializer_class = FloorSerializer
    
    def get_queryset(self):
        return self.queryset.filter(workspace_id=self.kwargs["workspace_pk"])
    
    def perform_create(self, serializer):
        workspace_id = self.kwargs["workspace_pk"]
        return serializer.save(workspace_id=workspace_id)
    